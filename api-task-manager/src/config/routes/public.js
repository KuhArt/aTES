const mount = require('koa-mount');

const healthResource = require('resources/health/public');

module.exports = (app) => {
  app.use(mount('/health', healthResource));
};
