/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const userService = require('resources/user/user.service');
const getSchema = require('schema/events');
const { KafkaProcessor } = require('../kafka-processor');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounts-tasks' });

const processor = new KafkaProcessor('accounts-stream', consumer, {
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

processor.on('account:created', async ({ data: user, metadata }) => {
  const [resource, name] = 'account:created'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(user);
  console.log('Validaton consume user create: ', result);

  if (result.error) {
    console.error(result.error);
    return;
  }

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
  const [resource, name] = 'account:updated'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(user);

  console.log('Validaton consume user update: ', result);

  if (result.error) {
    console.error(result.error);
    return;
  }

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
processor.on('account:updated', updateHandler);

async function main() {
  await processor.run();
}

main();
