const Joi = require('joi');

const eventMetadata = Joi.object({
  _id: Joi.string(),
  version: Joi.number().required(),
  name: Joi.string().required(),
  timestamp: Joi.date().required(),
  producer: Joi.string().required(),
  startProcessingOn: Joi.optional().allow(null),
});


const getSchema = ({ resource, name, version }) => {
  const resourceSchema = require(`./${resource}/${name}/v${version}`);

  if (!resourceSchema) {
    throw new Error(`No schema found for ${resource}:${name} v${version}`);
  }

  const schema = Joi.object({
    metadata: eventMetadata,
    data: resourceSchema,
  });
  
  return (obj) => schema.validate(obj, { allowUnknown: false });
}

module.exports = getSchema;
