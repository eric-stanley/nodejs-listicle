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
      message: 'You are not logged in! Please login to get access',
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
    passwordRecentlyChanged: {
      message: 'User recently changed password! Please login again',
      statusCode: 401,
    },
    noUserFound: {
      message: 'No user found with that email',
      statusCode: 404,
    },
    emailSendingError: {
      message: 'There was an error while sending the email. Try again later!',
      statusCode: 500,
    },
    tokenInvalidOrExpired: {
      message: 'Token is invalid or expired',
      statusCode: 400,
    },
    incorrectCurrentPassword: {
      message: 'Your current password is wrong',
      statusCode: 401,
    },
  },
  generalErrors: {
    duplicateKey: {
      errorCode: 11000,
      statusCode: 400,
    },
    noDocumentFound: {
      message: 'No document found with that ID',
      statusCode: 404,
    },
    invalidTokenError: {
      message: 'Invalid token. Please login again!',
      statusCode: 401,
    },
    expiredToken: {
      message: 'Your token has expired. Please login again!',
      statusCode: 401,
    },
  },
  userErrors: {
    noUserFound: {
      message: 'No user found with that id',
      statusCode: 401,
    },
    noRoleAssigned: {
      message: 'Not role assigned to the user',
      statusCode: 401,
    },
    invalidRole: {
      message: 'Invalid role assigned to the user',
      statusCode: 400,
    },
  },
};
