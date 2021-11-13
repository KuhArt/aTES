const attachThrowError = require('middlewares/attachThrowError');
const config = require('config');
const publicRoutes = require('./public');
const jwt = require('koa-jwt');

const defineRoutes = (app) => {
  app.use(attachThrowError);
  app.use(jwt({ secret: config.jwt.secret }))

  publicRoutes(app);
};

module.exports = defineRoutes;
