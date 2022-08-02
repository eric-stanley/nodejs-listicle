const { setupDB } = require('../testSetup');

const { valid, checkUserIdIncrement } = require('./tests/signup');
const {
  deletedUsertRoleCheck,
  checkDeletedUserUpdate,
  checkAuthenticatedDelete,
} = require('./tests/user');
const { inactiveUserLogin } = require('./tests/login');

setupDB();

describe('User specific test', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('given the email and password', () => {
      valid(0);
      checkUserIdIncrement(1, 2);
    });
  });

  describe('DELETE /api/v1/users/deleteMe', () => {
    describe('when the user with default role tries to delete account', () => {
      checkAuthenticatedDelete();
    });
  });

  describe('GET /api/v1/users/getRole', () => {
    describe('when the user tries to get the default role for inactive user', () => {
      deletedUsertRoleCheck();
    });
  });

  describe('GET /api/v1/users/updateMe', () => {
    describe('when the user tries to update inactive user', () => {
      checkDeletedUserUpdate();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('when the user tries to login with inactive user credentials', () => {
      inactiveUserLogin(0);
    });
  });
});
