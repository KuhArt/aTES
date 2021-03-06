const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const _ = require('lodash');

const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');
const taskService = require('resources/task/task.service');

const schema = Joi.object({});

async function validator(ctx, next) {
  const { userPublicId } = ctx.state.user;

  const user = await userService.findOne({ publicId: userPublicId });
  ctx.assertError(!user, {
    email: ['User doesn\'t exist'],
  });

  if (!['admin', 'manager'].includes(user.role)) {
    ctx.status = 401;
    ctx.body = {};
    return;
  }

  await next();
}

async function handler(ctx) {
  const { results: tasks } = await taskService.find({ status: 'active' });
  const { results: managers } = await userService.find({ role: 'manager' });

  const taskPromises = tasks.map(async (task) => {
    const managerIndex = _.random(managers.length);
    const newTask = await taskService.updateOne({ _id: task._id }, (old) => {
      return {
        ...old,
        assignedPublicId: managers[managerIndex].publicId,
      };
    });
    await kafkaService.send({
      topic: 'tasks',
      event: 'task:assigned',
      version: 1,
      data: _.pick(newTask, ['publicId', 'assignedPublicId']),
    });
  });

  ctx.body = Promise.all(taskPromises);
}

module.exports.register = (router) => {
  router.post('/close/:id', validate(schema), validator, handler);
};
