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
  const data = ctx.validatedData;
  const { id } = ctx.request.params;
  const task = await taskService.updateOne({ _id: id }, (old) => {
    return {
      ...old,
      status: 'closed'
    }
  });

  await kafkaService.send({
    topic: 'tasks',
    event: 'tasks:closed',
    data: task,
  });

  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/close/:id', validate(schema), validator, handler);
};
