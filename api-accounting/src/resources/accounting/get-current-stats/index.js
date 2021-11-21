const Joi = require('joi');
const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');
const transactionService = require('resources/transaction/transaction.service');
const moment = require('moment');

const schema = Joi.object({});

async function validator(ctx, next) {
  const { userPublicId } = ctx.state.user;

  const user = await userService.findOne({ publicId: userPublicId });
  ctx.assertError(user, {
    email: ['User doesn\'t exist'],
  });

  if (user.role !== 'employee') {
    ctx.status = 401;
    ctx.body = {};
    return;
  }

  await next();
}

async function handler(ctx) {
  const { userPublicId } = ctx.state.user;

  const user = await userService.findOne({ publicId: userPublicId });
  const { results: transactions } = await transactionService.find({
    'payload.assignedPublicId': user.publicId,
    createdOn: { $gte: moment().startOf('day').toDate() },
  });

  ctx.body = {
    balance: user.balance,
    transactions,
  };
}

module.exports.register = (router) => {
  router.get('/current-stats', validate(schema), validator, handler);
};
