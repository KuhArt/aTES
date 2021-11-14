const cron = require('scheduler/cron');
const userService = require('resources/user/user.service');
const transactionService = require('resources/transaction/transaction.service');
const { v4: uuidv4 } = require('uuid');

cron.on('cron:end-of-the-day', async () => {
  const { results: users } = await userService.find({ balance: { $gt: 0 } });

  const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);

  await transactionService.create({
    amount: totalBalance,
    publicId: uuidv4(),
    description: 'billing-cycle',
    type: 'credit',
    payload: {},
  });

  await userService.updateMany({ balance: { $gt: 0 } }, { $set: { balance: 0 } });
});
