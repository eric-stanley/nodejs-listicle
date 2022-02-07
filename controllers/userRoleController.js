const UserRole = require('../models/userRoleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

const defaultField = 'role_id';
const defaultPage = 1;
const defaultLimit = 10;

exports.checkUserRole = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    // Create path
    const { role_id, user_id } = req.body.fields.input;

    // Check if role exists
    const role = await Role.findById(role_id);

    if (!role) {
      return next(new AppError('No role found with that ID', 404));
    }

    // Check if user exists
    const user = await User.findById(user_id);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Check if user role combination exists and is active
    const userRole = await UserRole.findOne({
      role_id,
      user_id,
    });

    if (userRole && userRole.is_active) {
      return next(
        new AppError('User role combination is already exists and active', 403)
      );
    }
    if (userRole) {
      return next(
        new AppError(
          'User role already exists. Please use update path to acivate/inactivate role',
          403
        )
      );
    }
  } else {
    // Update path
    const userRole = await UserRole.findById(req.params.id);

    // Check if user role exists
    if (!userRole) {
      return next(new AppError('No user role found with that ID', 404));
    }

    const { role_id, user_id, is_active } = req.body.fields.input;

    // Check if is_active indicator is changed
    if (
      userRole.role_id.toString() === role_id &&
      userRole.user_id.toString() === user_id &&
      userRole.is_active === is_active
    ) {
      return next(new AppError('User role combination is already exists', 403));
    }
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
