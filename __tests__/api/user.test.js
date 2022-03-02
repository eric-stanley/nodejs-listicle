const { setupDB } = require('../testSetup');

setupDB();

const { valid } = require('./tests/signup');
const {
  defaultRoleCheck,
  checkAuthenticatedBadUpdate,
  checkUnAuthenticatedBadUpdate,
  checkAuthenticatedUpdate,
  checkUnAuthenticatedUpdate,
  checkAuthenticatedDelete,
  checkUnAuthenticatedDelete,
} = require('./tests/user');

describe('User specific test', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('given the email and password', () => {
      valid(0);
    });
  });

  describe('GET /api/v1/users/getRole', () => {
    describe('given the user tries to get the default role', defaultRoleCheck);
  });

  describe('PATCH /api/v1/users/updateMe', () => {
    describe('given the user with default role tries to update email or username', () => {
      checkAuthenticatedUpdate();
      checkUnAuthenticatedUpdate();
    });

    describe('given the user with default role tries to update password', () => {
      checkAuthenticatedBadUpdate();
      checkUnAuthenticatedBadUpdate();
    });
  });

  describe('DELETE /api/v1/users/deleteMe', () => {
    describe('given the user with default role tries to delete account', () => {
      checkAuthenticatedDelete();
      checkUnAuthenticatedDelete();
    });
  });
});
