const mount = require('koa-mount');

const proxy = require('koa2-proxy-middleware');

const userResource = require('resources/user');

const options = {
  targets: {
    '/task(.*)': {
      logLevel: 'debug',
      target: 'http://api-task-manager:3001',
      changeOrigin: true,
    },
    '/accounting(.*)': {
      logLevel: 'debug',
      target: 'http://api-accounting:3001',
      changeOrigin: true,
    },
  },
};

module.exports = (app) => {
  app.use(proxy(options));
  app.use(mount('/users', userResource));
};
