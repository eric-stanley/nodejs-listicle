const Run = require('../models/runModel');
const factory = require('./handlerFactory');

const defaultField = 'name';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllRuns = factory.getAll(
  Run,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getRun = factory.getOne(Run);
exports.createRun = factory.createOne(Run, defaultField);
exports.updateRun = factory.updateOne(Run, defaultField);
exports.deleteRun = factory.deleteOne(Run);
