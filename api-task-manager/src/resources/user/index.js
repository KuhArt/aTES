const Router = require('@koa/router');

require('./user.handler');

const router = new Router();


module.exports = router.routes();
