const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const { v4: uuidv4 } = require('uuid');

const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');
const taskService = require('resources/task/task.service');
const _ = require('lodash');

const schema = Joi.object({
  description: Joi.string()
    .required(),
  title: Joi.string()
    .required(),
  jira_id: Joi.string()
    .required(),
});

async function validator(ctx, next) {
  console.log('ctx.request.body: ', ctx.request.body);

  const [user] = await userService.aggregate([{ $match: { role: 'employee' } }, { $sample: { size: 1 } }]);

  ctx.validatedData = {
    ...ctx.validatedData,
    assignedPublicId: user.publicId,
  };

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;

  const task = await taskService.create({
    description: data.description,
    title: data.title,
    jira_id: data.jira_id,
    publicId: uuidv4(),
    assignedPublicId: data.assignedPublicId,
  });

  await kafkaService.send({
    topic: 'tasks-stream',
    event: 'task:created',
    version: 2,
    data: _.omit(task, ['_id']),
  });

  // await kafkaService.send({
  //   topic: 'tasks',
  //   event: 'task:assigned',
  //   version: 1,
  //   data: _.pick(task, ['publicId', 'assignedPublicId']),
  // });

  ctx.body = task;
}

module.exports.register = (router) => {
  router.post('/', validate(schema), validator, handler);
};
