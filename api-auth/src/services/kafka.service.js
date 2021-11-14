const { Kafka } = require('kafkajs');
const { nanoid } = require('nanoid');
const getSchema = require('schema/events');

const config = require('config');

const kafka = new Kafka(config.kafka);

const producer = kafka.producer();

exports.run = async () => {
  await producer.connect();
};

exports.send = async ({
  event, version, data, ...record
}) => {
  const message = {
    value: JSON.stringify({
      data,
      metadata: {
        _id: nanoid(),
        name: event,
        version,
        timestamp: new Date(),
        producer: 'api-auth',
      },
    }),
  };

  const [resource, name] = event.split(':');
  const validateMessage = getSchema({ resource, name, version });

  const result = validateMessage(message);

  if (result.error) {
    console.error(result.error);
    return;
  }

  console.log('Validaton result: ', result);

  await producer.send({
    ...record,
    messages: [message],
  });
};

exports.producer = producer;
