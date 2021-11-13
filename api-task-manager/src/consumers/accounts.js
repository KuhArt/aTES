/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const { KafkaProcessor } = require('../kafka-processor');
const userService = require('resources/user/user.service');
const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounts-tasks' });

const processor = new KafkaProcessor('accounts', consumer, {
  onStart: async (message) => {
    console.log('onStart')        
    return { skip: false };
  },
  onFail: async (message) => {
    console.log('onFail', message)
  },
  onSuccess: async (message) => {
    console.log('onSuccess', message)    
  },
});

processor.on('accounts:created', async (user) => {
  try {
    await userService.create({
      publicId: user.publicId,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  } catch (error) {
    console.error(error);
  }
});

const updateHandler = async (user) => {
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
      }
    })
  } catch (error) {
    console.error(error);
  }
}
processor.on('accounts:updated', updateHandler);
processor.on('accounts:roleHasChanged', updateHandler);

async function main() {
  await processor.run();
}

main();