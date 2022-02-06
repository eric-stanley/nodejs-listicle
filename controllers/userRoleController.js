const UserRole = require('../models/userRoleModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');

const defaultField = 'role_id';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllUserRoles = factory.getAll(
  UserRole,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getUserRole = factory.getOne(UserRole);
exports.deleteUserRole = factory.deleteOne(UserRole);

exports.createUserRole = catchAsync(async (req, res, next) => {
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
  let userRole = await UserRole.findOne({
    role_id,
    user_id,
  });

  const filteredBody = filterObj(req.body.fields.input, 'role_id', 'user_id');

  if (!userRole) {
    userRole = await UserRole.create(filteredBody);

    return res.status(201).json({
      status: 'success',
      data: {
        userRole,
      },
    });
  } else if (userRole.is_active) {
    return next(
      new AppError('User role combination is already exists and active', 403)
    );
  } else {
    userRole = await UserRole.findByIdAndUpdate(
      userRole.id,
      {
        is_active: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(201).json({
      status: 'success',
      data: {
        userRole,
      },
    });
  }
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  let userRole = await UserRole.findById(req.params.id);

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

  // Update user role if user role combination does not exist
  userRole.set({
    is_active,
  });

  await userRole.save({
    validateBeforeSave: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      userRole,
    },
  });
});
