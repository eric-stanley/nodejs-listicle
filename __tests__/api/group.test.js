const { setupDB } = require('../testSetup');

const { valid } = require('./tests/signup');
const { tokenCheck } = require('./tests/login');
const {
  getAllGroupsCheck,
  getOneGroupCheck,
  getAllGroupsServerError,
} = require('./tests/group');

setupDB();

describe('Group test', () => {
  describe('GET /api/v1/groups', () => {
    describe('given the user is logged in as admin', () => {
      tokenCheck(3);
    });

    describe('given the admin user tries to access groups routes', () => {
      getAllGroupsCheck(200);
      getOneGroupCheck(1, 'regression');
      getOneGroupCheck(2, 'smoke');
      getOneGroupCheck(3, 'uat');
      getOneGroupCheck(4, 'functional');
      getOneGroupCheck(5, 'system');
    });

    describe('given the admin user tries to access groups routes with empty body', () => {
      getAllGroupsServerError();
    });

    describe('given the non-admin user tries to access groups routes', () => {
      valid(0);
      getAllGroupsCheck(403);
    });
  });
});
