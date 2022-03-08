const { setupDB } = require('../testSetup');

const { valid } = require('./tests/signup');
const { tokenCheck } = require('./tests/login');
const {
  getAllStatusesCheck,
  getOneStatusCheck,
  getAllStatusesServerError,
} = require('./tests/status');

setupDB();

describe('Status test', () => {
  describe('GET /api/v1/status', () => {
    describe('given the user is logged in as admin', () => {
      tokenCheck(3);
    });

    describe('given the admin user tries to access status routes', () => {
      getAllStatusesCheck(200);
      getOneStatusCheck(1, 'passed');
      getOneStatusCheck(3, 'not completed');
    });

    describe('given the admin user tries to access status routes with empty body', () => {
      getAllStatusesServerError();
    });

    describe('given the non-admin user tries to access status routes', () => {
      valid(0);
      getAllStatusesCheck(403);
    });
  });
});
