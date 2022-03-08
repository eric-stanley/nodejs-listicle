const { setupDB } = require('../testSetup');

const { valid } = require('./tests/signup');
const { tokenCheck } = require('./tests/login');
const {
  getAllPrioritiesCheck,
  getOnePriorityCheck,
  getAllPrioritiesServerError,
} = require('./tests/priority');

setupDB();

describe('Priority test', () => {
  describe('GET /api/v1/priorities', () => {
    describe('given the user is logged in as admin', () => {
      tokenCheck(3);
    });

    describe('given the admin user tries to access priorities routes', () => {
      getAllPrioritiesCheck(200);
      getOnePriorityCheck(1, 'high');
      getOnePriorityCheck(2, 'medium');
      getOnePriorityCheck(3, 'low');
    });

    describe('given the admin user tries to access priorities routes with empty body', () => {
      getAllPrioritiesServerError();
    });

    describe('given the non-admin user tries to access priorities routes', () => {
      valid(0);
      getAllPrioritiesCheck(403);
    });
  });
});
