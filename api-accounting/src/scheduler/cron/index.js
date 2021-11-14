const schedule = require('node-schedule');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

schedule.scheduleJob('0 0 * * *', () => {
  eventEmitter.emit('cron:end-of-the-day');
});

module.exports = eventEmitter;
