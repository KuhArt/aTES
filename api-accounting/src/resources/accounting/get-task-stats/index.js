const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const _ = require('lodash');
const moment = require('moment');
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

  if (user.role !== 'admin') {
    ctx.status = 401;
    ctx.body = {};
    return;
  }

  await next();
}

async function handler(ctx) {
  const { startAt } = ctx.request.query;

  const tasks = await taskService.find({ createdOn: { $gte: startAt }, status: 'просо в миске' });

  const stats = _(tasks)
    .groupBy((task) => {
      return moment(task.createdOn).format('YYYY-MM-DD');
    })
    .mapValues((tasksGroup) => {
      return _.sortBy(tasksGroup, 'cost.closed')[0];
    }).value();

  ctx.body = stats;
}

module.exports.register = (router) => {
  router.get('/tasks-stats', validate(schema), validator, handler);
};
