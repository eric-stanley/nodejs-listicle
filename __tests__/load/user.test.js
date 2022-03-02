const { setupDB } = require('../test-setup');

setupDB();

const { multipleSignups, multipleLogins } = require('./tests/auth');
const numberOfSignupRequests = 10;
const numberOfLoginRequests = 10;

describe('User specific test', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('given ' + numberOfSignupRequests + ' signup requests', () => {
      multipleSignups(numberOfSignupRequests);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('given ' + numberOfLoginRequests + ' login requests', () => {
      multipleLogins(numberOfLoginRequests);
    });
  });
});
