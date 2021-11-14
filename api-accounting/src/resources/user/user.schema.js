const Joi = require('joi');

const schema = Joi.object({
  _id: Joi.string(),
  role: Joi.string().valid('employee', 'manager', 'admin').default('employee'),
  publicId: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  balance: Joi.number().required(),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
