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
  ctx.assertError(user, {
    user: ['User doesn\'t exist'],
  });

  if (user.role !== 'employee') {
    ctx.status = 401;
    ctx.body = {};
    return;
  }

  const { id } = ctx.request.params;

  const task = await taskService.findOne({ _id: id, status: 'птичка в клетке' });

  ctx.assertError(task, {
    task: ['Task doesn\'t exist'],
  });

  await next();
}

async function handler(ctx) {
  const { id } = ctx.request.params;
  const task = await taskService.updateOne({ _id: id }, (old) => {
    return {
      ...old,
      status: 'просо в миске',
    };
  });

  await kafkaService.send({
    topic: 'tasks',
    event: 'task:closed',
    version: 1,
    data: _.pick(task, ['publicId', 'assignedPublicId']),
  });

  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/close/:id', validate(schema), validator, handler);
};
