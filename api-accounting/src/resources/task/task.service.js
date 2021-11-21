const db = require('db');
const constants = require('app.constants');

const validateSchema = require('./task.schema');

const service = db.createService(constants.DATABASE_DOCUMENTS.TASKS, { validate: validateSchema });

module.exports = service;
