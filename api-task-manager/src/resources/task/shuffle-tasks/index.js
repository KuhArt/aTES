const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const { v4: uuidv4 } = require('uuid');

const validate = require('middlewares/validate');
const securityUtil = require('security.util');
const userService = require('resources/user/user.service');
const taskService = require('resources/task/task.service');

const config = require('config');

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
  const data = ctx.validatedData;

  const { results: tasks } = await taskService.find({ status: 'active' });
  const { results: managers } = await managerService.find({ role: 'manager' });

  const taskPromises = tasks.map(async (task) => {
    const managerIndex = (Math.random() * managers.length) | 0
    const newTask = await taskService.updateOne({ _id: id }, (old) => {
      return {
        ...old,
        assignedPublicId: manager[managerIndex].publicId
      }
    });
    await kafkaService.send({
      topic: 'tasks',
      event: 'tasks:assigned',
      data: task,
    });
  })


  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/close/:id', validate(schema), validator, handler);
};
