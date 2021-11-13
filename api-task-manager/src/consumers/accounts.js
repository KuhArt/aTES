/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const userService = require('resources/user/user.service');
const getSchema = require('schema/events');
const { KafkaProcessor } = require('../kafka-processor');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounts-tasks' });

const processor = new KafkaProcessor('accounts', consumer, {
  onStart: async () => {
    console.log('onStart');
    return { skip: false };
  },
  onFail: async (message) => {
    console.log('onFail', message);
  },
  onSuccess: async (message) => {
    console.log('onSuccess', message);
  },
});

processor.on('accounts:created', async ({ data: user, metadata }) => {
  const [resource, name] = 'accounts:created'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(user);
  console.log('Validaton consume user create: ', result);

  try {
    await userService.create({
      publicId: user.publicId,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
  }
});

const updateHandler = async ({ data: user, metadata }) => {
  const [resource, name] = 'accounts:updated'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(user);

  console.log('Validaton consume user update: ', result);

  try {
    await userService.updateOne({
      publicId: user.publicId,
    },
    (old) => {
      return {
        ...old,
        publicId: user.publicId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    });
  } catch (error) {
    console.error(error);
  }
};
processor.on('accounts:updated', updateHandler);

async function main() {
  await processor.run();
}

main();
