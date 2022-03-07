const signToken = require('./signToken');

module.exports = (user, statusCode, res) => {
  const token = signToken(user._id);

  const returnUser = user.toObject();

  // Remove unwanted fields before sending the response
  returnUser._id =
    returnUser.id =
    returnUser.__v =
    returnUser.created_at =
    returnUser.updated_at =
    returnUser.password =
      undefined;

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: returnUser,
    },
  });
};
