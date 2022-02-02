const Priority = require('../models/priorityModel');
const factory = require('./handlerFactory');

const defaultField = 'description';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllPriorities = factory.getAll(
  Priority,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getPriority = factory.getOne(Priority);
exports.createPriority = factory.createOne(Priority);
exports.updatePriority = factory.updateOne(Priority);
exports.deletePriority = factory.deleteOne(Priority);
