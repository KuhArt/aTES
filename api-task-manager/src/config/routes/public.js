const mount = require('koa-mount');

const healthResource = require('resources/health/public');
const taskResource = require('resources/task');

module.exports = (app) => {
  app.use(mount('/health', healthResource));
  app.use(mount('/task', taskResource));
};
