const { setupDB } = require('../testSetup');

const { valid } = require('./tests/signup');
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
      getAllRolesCheck(200);
      getOneRoleCheck(1, 'admin');
      getOneRoleCheck(2, 'portfolio manager');
      getOneRoleCheck(3, 'program manager');
      getOneRoleCheck(4, 'project manager');
      getOneRoleCheck(5, 'test lead');
      getOneRoleCheck(6, 'team lead');
      getOneRoleCheck(7, 'team member');
      getOneRoleCheck(8, 'guest');
    });

    describe('given the admin user tries to access roles routes with empty body', () => {
      getAllRolesServerError();
    });

    describe('given the non-admin user tries to access roles routes', () => {
      valid(0);
      getAllRolesCheck(403);
    });
  });
});
