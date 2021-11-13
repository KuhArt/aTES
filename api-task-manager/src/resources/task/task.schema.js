const Joi = require('joi');

const schema = Joi.object({
  _id: Joi.string(),
  publicId: Joi.string(),
  assignedPublicId: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  description: Joi.string()
    .required(),
  title: Joi.string()
    .required(),
  status: Joi.string().valid('active', 'closed').default('active'),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
