const { setupDB } = require('../testSetup');

const { tokenCheck } = require('./tests/login');
const {
  getAllRolesCheck,
  getOneRoleCheck,
  getAllRolesServerError,
} = require('./tests/role');

setupDB();

describe('Role test', () => {
  describe('GET /api/v1/roles', () => {
    describe('given the user is logged in as admin', () => {
      tokenCheck(3);
    });

    describe('given the admin user tries to access roles routes', () => {
      getAllRolesCheck();
      getOneRoleCheck(2, 'portfolio manager');
      getOneRoleCheck(5, 'test lead');
    });

    describe('given the admin user tries to access roles routes with empty body', () => {
      getAllRolesServerError();
    });
  });
});
