const joi = require('joi');

const schema = Joi.object({
  publicId: Joi.string(),
});

module.exports = schema;