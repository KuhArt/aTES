const Router = require('@koa/router');

const router = new Router();

require('./get-current').register(router);
require('./update').register(router);
require('./list-users').register(router);

module.exports = router.routes();
