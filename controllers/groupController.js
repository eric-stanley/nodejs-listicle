const Group = require('../models/groupModel');
const factory = require('./handlerFactory');

const defaultField = 'description';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllGroups = factory.getAll(
  Group,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getGroup = factory.getOne(Group);
exports.createGroup = factory.createOne(Group);
exports.updateGroup = factory.updateOne(Group);
exports.deleteGroup = factory.deleteOne(Group);
