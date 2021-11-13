const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const { v4: uuidv4 } = require('uuid');

const validate = require('middlewares/validate');
const securityUtil = require('security.util');
const userService = require('resources/user/user.service');
const taskService = require('resources/task/task.service');

const config = require('config');

const schema = Joi.object({
  assignedPublicId: Joi.string(),
  description: Joi.string()
    .required(),
  title: Joi.string()
    .required(),
});

async function validator(ctx, next) {
  const { assignedPublicId } = ctx.validatedData;

  const isUserExists = await userService.exists({ publicId: assignedPublicId });
  ctx.assertError(!isUserExists, {
    email: ['User with this email is already registered'],
  });

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;
  
  const task = await taskService.create({
    description: data.firstName,
    title: data.lastName,
    publicId: uuidv4(),
    assignedPublicId: data.assignedPublicId,
  });

  await kafkaService.send({
    topic: 'tasks',
    event: 'tasks:created',
    data: task,
  });

  await kafkaService.send({
    topic: 'tasks',
    event: 'tasks:assigned',
    data: task,
  });

  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/', validate(schema), validator, handler);
};
