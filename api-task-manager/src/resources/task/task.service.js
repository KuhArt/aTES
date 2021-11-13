const _ = require('lodash');

const db = require('db');
const constants = require('app.constants');

const validateSchema = require('./task.schema');

const service = db.createService(constants.DATABASE_DOCUMENTS.TASKS, { validate: validateSchema });

const privateFields = [];

service.getPublic = (user) => {
  return _.omit(user, privateFields);
};

module.exports = service;
