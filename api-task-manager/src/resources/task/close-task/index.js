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

  if (user.role !== 'manager') {
    ctx.status = 401;
    ctx.body = {};
    return;
  }

  const { id } = ctx.request.params;

  const task = await taskService.findOne({ _id: id, status: 'active' });
  ctx.assertError(!task, {
    email: ['Task doesn\'t exist'],
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
    version: 2,
    data: _.omit(task, ['_id']),
  });

  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/close/:id', validate(schema), validator, handler);
};
