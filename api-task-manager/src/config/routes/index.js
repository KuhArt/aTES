const attachThrowError = require('middlewares/attachThrowError');

const auth = require('./middlewares/auth.middleware');
const tryToAttachUser = require('./middlewares/tryToAttachUser.middleware');
const extractTokens = require('./middlewares/extractTokens.middleware');
const publicRoutes = require('./public');

const defineRoutes = (app) => {
  app.use(attachThrowError);

  app.use(tryToAttachUser);

  publicRoutes(app);
};

module.exports = defineRoutes;
