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
    inactiveUser: {
      message: 'The user belonging to the token no longer exist',
      statusCode: 401,
    },
  },
  generalErrors: {
    duplicateKey: {
      errorCode: 11000,
      statusCode: 400,
    },
  },
};
