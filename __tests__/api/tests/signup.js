const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');
const errors = require('../../../constants/errors');

exports.valid = () => {
  test('should respond with a 201 status code with token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData.users[0]);
    expect(response.statusCode).toBe(201);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body.token).toBeDefined();
    process.env.JWT_TOKEN = response.body.token;
  });
};

exports.invalid = () => {
  test(
    'should respond with a ' +
      errors.generalErrors.duplicateKey.statusCode +
      ' status code with content type as json and error code as ' +
      errors.generalErrors.duplicateKey.errorCode,
    async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData.users[0]);
      expect(response.statusCode).toBe(
        errors.generalErrors.duplicateKey.statusCode
      );
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body.error.code).toBe(
        errors.generalErrors.duplicateKey.errorCode
      );
    }
  );
};
