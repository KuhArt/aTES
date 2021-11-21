const db = require('db');
const constants = require('app.constants');

const validateSchema = require('./transaction.schema');

const service = db.createService(
  constants.DATABASE_DOCUMENTS.TRANSACTIONS,
  { validate: validateSchema },
);

module.exports = service;
