const UserRole = require('../models/userRoleModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const checkAccess = require('../utils/checkAccess');

const defaultField = 'role_id';
const defaultPage = 1;
const defaultLimit = 10;

exports.checkUserRole = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    // Create path
    checkAccess.checkUserRoleInput(req.body.fields.input, next);
  } else {
    // Update path
    checkAccess.checkUserRoleId(req.params.id, req.body.fields.input, next);
  }

  next();
});

exports.getAllUserRoles = factory.getAll(
  UserRole,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getUserRole = factory.getOne(UserRole, ['users', 'roles']);
exports.createUserRole = factory.createOne(UserRole, 'user_id', 'role_id');
exports.updateUserRole = factory.updateOne(UserRole, 'is_active');
exports.deleteUserRole = factory.deleteOne(UserRole);
