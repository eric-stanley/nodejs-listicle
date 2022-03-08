const { setupDB } = require('../testSetup');

const { valid } = require('./tests/signup');
const { tokenCheck } = require('./tests/login');
const {
  getAllEnvironmentsCheck,
  getOneEnvironmentCheck,
  getAllEnvironmentsServerError,
} = require('./tests/environment');

setupDB();

describe('Environment test', () => {
  describe('GET /api/v1/environments', () => {
    describe('given the user is logged in as admin', () => {
      tokenCheck(3);
    });

    describe('given the admin user tries to access environments routes', () => {
      getAllEnvironmentsCheck(200);
      getOneEnvironmentCheck(1, 'qa');
      getOneEnvironmentCheck(2, 'dev');
      getOneEnvironmentCheck(3, 'uat');
      getOneEnvironmentCheck(4, 'prod');
    });

    describe('given the admin user tries to access environments routes with empty body', () => {
      getAllEnvironmentsServerError();
    });

    describe('given the non-admin user tries to access environments routes', () => {
      valid(0);
      getAllEnvironmentsCheck(403);
    });
  });
});
