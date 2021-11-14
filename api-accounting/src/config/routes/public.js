const mount = require('koa-mount');

const healthResource = require('resources/health/public');
const taskResource = require('resources/accounting');

module.exports = (app) => {
  app.use(mount('/health', healthResource));
  app.use(mount('/accounting', taskResource));
};
