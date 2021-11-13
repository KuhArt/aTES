const Joi = require('joi');

const schema = Joi.object({
  publicId: Joi.string(),
  role: Joi.string().valid('employee', 'manager', 'admin').default('employee'),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
});

module.exports = schema;