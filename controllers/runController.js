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

exports.generateRun = (req, res, next) => {
  req.body.fields.input.name =
    new Date()
      .toISOString()
      .replaceAll('-', '_')
      .replaceAll(':', '_')
      .replaceAll('.', '_') +
    '_' +
    Math.random().toString(20).substring(2, 8);
  next();
};
