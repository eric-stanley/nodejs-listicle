const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const catchAsync = require('../utils/catchAsync');
const createAndSendToken = require('../utils/createAndSendToken');

exports.getAllUsers = catchAsync(async (req, res) => {
  const defaultField = 'name';
  const defaultPage = 1;
  const defaultLimit = 10;

  // Execute query
  const features = new APIFeatures(
    User.find(),
    req.body,
    defaultField,
    defaultPage,
    defaultLimit
  )
    .filter()
    .sort()
    .select()
    .paginate();
  const users = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (
    req.body.fields.input.password ||
    req.body.fields.input.password_confirm
  ) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updatePassword',
        400
      )
    );
  }
  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body.fields.input, 'username', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

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

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body.fields.input,
    'username',
    'password',
    'password_confirm',
    'email'
  );

  const user = await User.create(filteredBody);

  createAndSendToken(user, 201, res);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body.fields.input,
    'username',
    'password',
    'password_confirm',
    'email'
  );
  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
