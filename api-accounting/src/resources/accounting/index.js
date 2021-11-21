const Router = require('@koa/router');

const router = new Router();

require('./get-totals').register(router);
require('./get-current-stats').register(router);
require('./get-task-stats').register(router);

module.exports = router.routes();
