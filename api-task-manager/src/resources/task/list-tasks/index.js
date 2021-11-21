const Joi = require('joi');

const validate = require('middlewares/validate');
const taskService = require('resources/task/task.service');

const schema = Joi.object({});

async function handler(ctx) {
  const tasks = await taskService.find();
  ctx.body = tasks.results;
}

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};
