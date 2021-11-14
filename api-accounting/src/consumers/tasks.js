/* eslint-disable no-console */

const { Kafka } = require('kafkajs');
const taskService = require('resources/task/task.service');
const { v4: uuidv4 } = require('uuid');

const getSchema = require('schema/events');
const transactionService = require('resources/transaction/transaction.service');
const userService = require('resources/user/user.service');

const _ = require('lodash');
const { KafkaProcessor } = require('../kafka-processor');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'accounts-tasks' });

const getAssignedTaskCost = () => {
  return _.random(10, 20);
};
const getClosesdTaskCost = () => {
  return _.random(20, 40);
};

const processor = new KafkaProcessor('accounts', consumer, {
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
  const [resource, name] = 'task:created'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(task);

  try {
    await taskService.create({
      publicId: task.publicId,
      assignedPublicId: task.assignedPublicId,
      title: task.title,
      cost: {
        assigned: getAssignedTaskCost(),
        closed: getClosesdTaskCost(),
      },
    });
  } catch (error) {
    console.error(error);
  }
});

processor.on('task:assigned', async ({ data: task, metadata }) => {
  const [resource, name] = 'task:assigned'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(task);

  try {
    const taskWithCost = await taskService.findOne({ publicId: task.publicId });

    await taskService.updateOne({ publicId: task.publicId }, (old) => {
      return {
        ...old,
        assignedPublicId: task.assignedPublicId,
      };
    });

    await transactionService.create({
      amount: taskWithCost.cost.assigned,
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
        balance: old.balance - taskWithCost.cost.assigned,
      };
    });
  } catch (error) {
    console.error(error);
  }
});

processor.on('task:closed', async ({ data: task, metadata }) => {
  const [resource, name] = 'd'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(task);

  try {
    const taskWithCost = await taskService.findOne({ publicId: task.publicId });

    await taskService.updateOne({ publicId: task.publicId }, (old) => {
      return {
        ...old,
        status: 'просо в миске',
      };
    });

    await transactionService.create({
      amount: taskWithCost.cost.closed,
      publicId: uuidv4(),
      description: 'task:closed',
      type: 'credit',
      payload: {
        assignedPublicId: task.assignedPublicId,
        taskPublicId: task.publicId,
      },
    });

    await userService.updateOne({ publicId: task.assignedPublicId }, (old) => {
      return {
        ...old,
        balance: old.balance + taskWithCost.cost.closed,
      };
    });
  } catch (error) {
    console.error(error);
  }
});

const updateHandler = async ({ data: task, metadata }) => {
  const [resource, name] = 'task:updated'.split(':');
  const validate = getSchema({ resource, name, version: metadata.version });

  const result = validate(task);

  try {
    await userService.updateOne({
      publicId: task.publicId,
    },
    (old) => {
      return {
        ...old,
        publicId: task.publicId,
        assignedPublicId: task.assignedPublicId,
        title: task.title,
      };
    });
  } catch (error) {
    console.error(error);
  }
};
processor.on('task:updated', updateHandler);

async function main() {
  await processor.run();
}

main();
