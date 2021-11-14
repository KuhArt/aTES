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
  const tasksCompleted = await taskService.find({ createdOn: { $gte: moment().startOf('day') }, status: 'просо в миске' });
  const tasksAssigned = await taskService.find({ createdOn: { $gte: moment().startOf('day') }, status: 'птичка в клетке' });

  const completedAmount = _.sumBy(tasksCompleted, 'amount');
  const assignedAmount = _.sumBy(tasksAssigned, 'amount');

  const usersWithNegativeBalance = await userService.count({ balance: { $lte: 0 } });

  ctx.body = {
    amount: assignedAmount - completedAmount,
    usersWithNegativeBalance,
  };
}

module.exports.register = (router) => {
  router.get('/tasks-stats', validate(schema), validator, handler);
};
