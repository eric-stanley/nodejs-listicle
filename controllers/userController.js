const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const filterObj = require('../utils/filterObj');
const UserRole = require('../models/userRoleModel');
const Role = require('../models/roleModel');
const errors = require('../constants/errors');

const defaultField = 'name';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllUsers = factory.getAll(
  User,
  defaultField,
  defaultPage,
  defaultLimit
);

exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(
  User,
  'username',
  'password',
  'password_confirm',
  'email'
);
exports.updateUser = factory.updateOne(User, [
  'username',
  'password',
  'password_confirm',
  'email',
]);
exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (
    req.body.fields.input.password ||
    req.body.fields.input.password_confirm
  ) {
    return next(
      new AppError(
        errors.authErrors.passwordUpdate.message,
        errors.authErrors.passwordUpdate.statusCode
      )
    );
  }
  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body.fields.input, ['username', 'email']);

  // 3) Update user document
  let updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select('-__v -created_at -updated_at');

  updatedUser = updatedUser.toObject();
  updatedUser._id = updatedUser.id = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    is_active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getRole = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    new AppError('Not user found with that id or user not logged in', 401);
  }

  const userRole = await UserRole.findOne({
    user_id: user.id,
  });

  if (!userRole) {
    new AppError('Not role assigned to the user', 401);
  }

  const role = await Role.findById(userRole.role_id).select('-_id -__v');

  if (!role) {
    new AppError('Invalid role assigned to the user', 400);
  }

  res.status(200).json({
    status: 'success',
    data: role,
  });
});
