const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const createAndSendToken = require('../utils/createAndSendToken');
const sendEmail = require('../utils/email');
const filterObj = require('../utils/filterObj');
const getUserRole = require('../utils/getUserRole');
const getDefaultRole = require('../utils/getDefaultRole');
const errors = require('../constants/errors');

exports.signup = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body.fields.input, [
    'username',
    'password',
    'password_confirm',
    'email',
  ]);

  const user = await User.create(filteredBody);
  const defaultRole = await getDefaultRole();

  await UserRole.create({
    role_id: defaultRole.id,
    user_id: user.id,
  });

  createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  let user;

  const { email, password } = req.body.fields.input;

  if (!email || !password) {
    return next(
      new AppError(
        errors.authErrors.undefinedEmailPassword.message,
        errors.authErrors.undefinedEmailPassword.statusCode
      )
    );
  }

  user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        errors.authErrors.incorrectEmailPassword.message,
        errors.authErrors.incorrectEmailPassword.statusCode
      )
    );
  }

  user = await User.findOne({
    email,
  }).select('+is_active');

  if (!user.is_active) {
    return next(
      new AppError(
        errors.authErrors.inactiveUser.message,
        errors.authErrors.inactiveUser.statusCode
      )
    );
  }

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if its there
  let token, currentUser;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        errors.authErrors.undefinedToken.message,
        errors.authErrors.undefinedToken.statusCode
      )
    );
  }

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        errors.authErrors.inactiveToken.message,
        errors.authErrors.inactiveToken.statusCode
      )
    );
  }

  // 4) Check if the user changed password after token was issued
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.', 401)
    );
  }

  currentUser = await User.findById(decoded.id).select('+is_active');

  if (!currentUser.is_active) {
    return next(
      new AppError(
        errors.authErrors.inactiveUser.message,
        errors.authErrors.inactiveUser.statusCode
      )
    );
  }

  // Get current user role and check if administrator
  const userRole = await getUserRole(currentUser.id, next);

  if (userRole.description.toLowerCase() === 'admin') {
    currentUser.is_admin = true;
  }

  // Grant access to protected route
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    const userRole = await getUserRole(req.user.id, next);

    if (!roles.includes(userRole.description.toLowerCase())) {
      return next(
        new AppError(
          errors.authErrors.restrictPermission.message,
          errors.authErrors.restrictPermission.statusCode
        )
      );
    }

    next();
  });

exports.restrictFrom = (...roles) =>
  catchAsync(async (req, res, next) => {
    const userRole = await getUserRole(req.user.id, next);

    if (roles.includes(userRole.description.toLowerCase())) {
      return next(
        new AppError(
          errors.authErrors.restrictPermission.message,
          errors.authErrors.restrictPermission.statusCode
        )
      );
    }

    next();
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({
    email: req.body.fields.input.email,
  });

  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  // 2) Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });

  // 3) Send token to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and password confirm to ${resetURL}.\n If you didn't forget your password, please ignroe this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Listicle: Your password reset token (valid for 10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    return next(
      new AppError(
        'There was an error while sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    password_reset_token: hashedToken,
    password_reset_expires: {
      $gt: Date.now(),
    },
  });

  // 2) Set new password if token is not expired and user exists
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.fields.input.password;
  user.password_confirm = req.body.fields.input.password_confirm;
  user.password_reset_token = undefined;
  user.password_reset_expires = undefined;

  await user.save();

  // 3) Update changedPasswordAt property for current user
  // Done in User model

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (
    !(await user.correctPassword(
      req.body.fields.input.password_current,
      user.password
    ))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) Update password
  user.password = req.body.fields.input.password;
  user.password_confirm = req.body.fields.input.password_confirm;

  await user.save();

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.updateFilter = (filterField) => (req, res, next) => {
  const filter = {};
  // Retrieve all docs if admin
  if (!req.user.is_admin) {
    filter[filterField] = req.user.id;
  }

  // Apply id filter
  if (req.params.id) {
    filter.id = req.params.id;
  }

  req.body.filter = filter;

  next();
};
