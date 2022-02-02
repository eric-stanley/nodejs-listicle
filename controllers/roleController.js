const Role = require('../models/roleModel');
const factory = require('./handlerFactory');

const defaultField = 'description';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllRoles = factory.getAll(
  Role,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getRole = factory.getOne(Role);
exports.createRole = factory.createOne(Role);
exports.updateRole = factory.updateOne(Role);
exports.deleteRole = factory.deleteOne(Role);
