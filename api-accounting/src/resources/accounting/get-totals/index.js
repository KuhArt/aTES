const Joi = require('joi');
const kafkaService = require('services/kafka.service');
const _ = require('lodash');

const moment = require('moment');
const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');
const taskService = require('resources/task/task.service');
const transactionService = require('resources/transaction/transaction.service');

const schema = Joi.object({});

async function validator(ctx, next) {
  const { userPublicId } = ctx.state.user;

  const user = await userService.findOne({ publicId: userPublicId });
  ctx.assertError(user, {
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
  const { results: transactions } = await transactionService.find({ createdOn: { $gte: moment().startOf('day').toDate() } });

  const creditAmount = _.sumBy(transactions.filter(({ type }) => type === 'credit'), 'amount');
  const debitAmount = _.sumBy(transactions.filter(({ type }) => type === 'debit'), 'amount');

  const usersWithNegativeBalance = await userService.count({ balance: { $lte: 0 }, role: 'employee' });

  ctx.body = {
    amount: debitAmount - creditAmount,
    usersWithNegativeBalance,
    transactions,
  };
}

module.exports.register = (router) => {
  router.get('/totals', validate(schema), validator, handler);
};
