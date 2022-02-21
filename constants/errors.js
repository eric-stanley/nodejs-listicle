module.exports = {
  authErrors: {
    undefinedEmailPassword: {
      message: 'Please provide email and password',
      statusCode: 400,
    },
    incorrectEmailPassword: {
      message: 'Incorrect email or password',
      statusCode: 401,
    },
    inactiveToken: {
      message: 'The user belonging to the token no longer exist',
      statusCode: 401,
    },
    inactiveUser: {
      message: 'User is not active. Please contact administrator',
      statusCode: 401,
    },
    undefinedToken: {
      message: 'You are not logged in! Please login to get access.',
      statusCode: 401,
    },
    passwordUpdate: {
      message:
        'This route is not for password update. Please use /updatePassword',
      statusCode: 400,
    },
    restrictPermission: {
      message: 'You do not have permission to perform this action',
      statusCode: 403,
    },
  },
  generalErrors: {
    duplicateKey: {
      errorCode: 11000,
      statusCode: 400,
    },
  },
};
