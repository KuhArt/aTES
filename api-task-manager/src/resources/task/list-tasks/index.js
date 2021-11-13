const Joi = require('joi');

const validate = require('middlewares/validate');
const taskService = require('resources/task/task.service');

const schema = Joi.object({
  assignedPublicId: Joi.string().required(),
  limit: Joi.number().required(),
  page: Joi.number().required(),
  sortKey: Joi.string().trim().required(),
  sortDirection: Joi.number().required(),
});

async function handler(ctx) {
  const {
    limit, page, sortKey, sortDirection, assignedPublicId,
  } = ctx.validatedData;

  const users = await taskService.find(
    { assignedPublicId },
    { page, perPage: limit, sort: { [sortKey]: sortDirection } },
  );

  ctx.body = {
    items: users.results,
    totalPages: users.pagesCount,
    currentPage: page,
  };
}

module.exports.register = (router) => {
  router.get('/user', validate(schema), handler);
};