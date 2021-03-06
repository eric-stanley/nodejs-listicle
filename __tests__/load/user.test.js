const { setupDB } = require('../testSetup');

const { multipleSignups, multipleLogins } = require('./tests/auth');
const numberOfSignupRequests = 15;
const numberOfLoginRequests = 15;

setupDB();

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
