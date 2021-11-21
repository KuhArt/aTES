const Joi = require('joi');

const schema = Joi.object({
  publicId: Joi.string(),
  assignedPublicId: Joi.string(),
});

module.exports = schema;