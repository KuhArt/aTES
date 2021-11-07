/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const { KafkaProcessor } = require('../kafka-processor');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounts-tasks' });

const processor = new KafkaProcessor('accounts', consumer, {
  onStart: async (message) => {
    console.log('onStart')        
    return { skip: false };
  },
  onFail: async (message) => {
    console.log('onFail')
  },
  onSuccess: async (message) => {
    console.log('onSuccess')    
  },
});

processor.on('accounts:created', async ({ data: user }) => {
  try {
    console.log('accounts:created','accounts:created','accounts:created')
  } catch (error) {
    console.error(error);
  }
});

console.log('processor.topic: ', processor.topic)

async function main() {
  await processor.run();
}

main();