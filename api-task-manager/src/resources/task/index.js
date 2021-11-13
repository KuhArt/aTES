const Router = require('@koa/router');

const router = new Router();

require('./close-task').register(router);
require('./create-task').register(router);
require('./list-tasks').register(router);
require('./shuffle-tasks').register(router);

module.exports = router.routes();
