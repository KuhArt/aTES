const attachThrowError = require('middlewares/attachThrowError');
const config = require('config');
const jwt = require('koa-jwt');
const publicRoutes = require('./public');

const defineRoutes = (app) => {
  app.use(attachThrowError);
  app.use(jwt({ secret: config.jwt.secret }));

  publicRoutes(app);
};

module.exports = defineRoutes;
