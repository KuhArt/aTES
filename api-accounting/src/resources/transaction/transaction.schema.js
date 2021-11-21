const Joi = require('joi');

const schema = Joi.object({
  _id: Joi.string(),
  publicId: Joi.string(),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid('debit', 'credit'),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  payload: Joi.optional().allow(null),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
