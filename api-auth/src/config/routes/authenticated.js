const mount = require('koa-mount');
const convert = require('koa-connect');
const proxy = require('http-proxy-middleware');

const userResource = require('resources/user');

module.exports = (app) => {
  app.use(convert(proxy.createProxyMiddleware((
    '/tasks',
    {
      logLevel: 'debug',
      target: 'http://api-task-manager:3001',
      changeOrigin: true,
    }
  )))); 
  app.use(convert(proxy.createProxyMiddleware((
    '/accounting',
    {
      logLevel: 'debug',
      target: 'http://api-accounting:3001',
      changeOrigin: true,
    }
  ))));
  app.use(mount('/users', userResource));
};
