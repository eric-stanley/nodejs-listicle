const Environment = require('../models/environmentModel');
const factory = require('./handlerFactory');

const defaultField = 'description';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllEnvironments = factory.getAll(
  Environment,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getEnvironment = factory.getOne(Environment);
exports.createEnvironment = factory.createOne(Environment, defaultField);
exports.updateEnvironment = factory.updateOne(Environment, defaultField);
exports.deleteEnvironment = factory.deleteOne(Environment);
