const Status = require('../models/statusModel');
const factory = require('./handlerFactory');

const defaultField = 'description';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllStatuses = factory.getAll(
  Status,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getStatus = factory.getOne(Status);
exports.createStatus = factory.createOne(Status);
exports.updateStatus = factory.updateOne(Status);
exports.deleteStatus = factory.deleteOne(Status);
