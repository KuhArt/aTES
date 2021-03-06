const Joi = require('joi');

const kafkaService = require('services/kafka.service');
const _ = require('lodash');

const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  userId: Joi.string(),
  firstName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  role: Joi.string().valid('employee', 'manager', 'admin').default('employee'),
});

async function validator(ctx, next) {
  const { email, userId } = ctx.validatedData;

  const isEmailInUse = await userService.exists({
    _id: { $ne: ctx.state.user._id },
    email,
  });

  ctx.assertError(!isEmailInUse, {
    email: ['This email is already in use'],
  });

  const isUserExists = await userService.exists({
    _id: userId,
  });

  ctx.assertError(!isUserExists, {
    userId: ['This user doesn\'t exist'],
  });

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;

  const user = await userService.updateOne(
    { _id: data.userId },
    (old) => {
      return { ...old, ...data };
    },
  );

  await kafkaService.send({
    topic: 'accounts-stream',
    event: 'account:updated',
    version: 1,
    data: _.pick(user, ['publicId', 'firstName', 'lastName', 'email', 'role']),
  });

  ctx.body = userService.getPublic(user);
}

module.exports.register = (router) => {
  router.put('/', validate(schema), validator, handler);
};
