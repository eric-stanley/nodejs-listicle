const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');
const errors = require('../../../constants/errors');

exports.inactiveUserLogin = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.inactiveUser.statusCode +
      ' with error message as "' +
      errors.authErrors.inactiveUser.message +
      '"',
    async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(userData.users[2]);

      expect(response.statusCode).toBe(
        errors.authErrors.inactiveUser.statusCode
      );
      expect(response.body.message).toBe(
        errors.authErrors.inactiveUser.message
      );
    }
  );
};
