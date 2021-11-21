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
    .regex(/^\[.*\].*/, { invert: true })
    .required(),
  jira_id: Joi.string().required(),
  cost: Joi.object({
    closed: Joi.number().required(),
    assigned: Joi.number().required(),
  }).required(),
  status: Joi.string().valid('птичка в клетке', 'просо в миске').default('птичка в клетке'),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
