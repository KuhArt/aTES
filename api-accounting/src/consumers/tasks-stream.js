/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const taskService = require('resources/task/task.service');
const { v4: uuidv4 } = require('uuid');

const getSchema = require('schema/events');

const _ = require('lodash');
const { KafkaProcessor } = require('../kafka-processor');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounting-tasks-stream' });

const transactionService = require('resources/transaction/transaction.service');
const userService = require('resources/user/user.service');

const getAssignedTaskCost = () => {
  return _.random(10, 20);
};
const getClosesdTaskCost = () => {
  return _.random(20, 40);
};

const processor = new KafkaProcessor('tasks-stream', consumer, {
  onStart: async (message) => {
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

processor.on('task:created', async ({ data: task, metadata }) => {
  console.log('task:created', task);
  const [resource, name] = 'task:created'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate({
    data: task,
    metadata,
  });

  if (result.error) {
    console.error(result.error);
    return;
  }

  try {
    const createdTask = await taskService.create({
      publicId: task.publicId,
      assignedPublicId: task.assignedPublicId,
      title: task.title,
      description: task.description,
      jira_id: task.jira_id,
      cost: {
        assigned: getAssignedTaskCost(),
        closed: getClosesdTaskCost(),
      },
    });

    await transactionService.create({
      amount: createdTask.cost.assigned,
      publicId: uuidv4(),
      description: 'task:assigned',
      type: 'debit',
      payload: {
        assignedPublicId: task.assignedPublicId,
        taskPublicId: task.publicId,
      },
    });

    await userService.updateOne({ publicId: task.assignedPublicId }, (old) => {
      return {
        ...old,
        balance: old.balance - createdTask.cost.assigned,
      };
    });
  } catch (error) {
    console.error(error);
  }
});

async function main() {
  await processor.run();
}

main();
