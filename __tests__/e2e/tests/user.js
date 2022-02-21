const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');
const errors = require('../../../constants/errors');

exports.checkAuthenticatedDelete = () => {
  test('should respond with a status code of 204 if authenticated and response data is empty', async () => {
    const response = await request(app)
      .delete('/api/v1/users/deleteMe')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
    expect(response.statusCode).toBe(204);
    expect(response.body).toMatchObject({});
  });
};

exports.checkDeletedUserUpdate = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.inactiveUser.statusCode +
      ' with error message as "' +
      errors.authErrors.inactiveUser.message +
      '"',
    async () => {
      const bodyData = [
        {
          fields: {
            input: { email: userData.users[1].fields.input.email },
          },
        },
        {
          fields: {
            input: { username: userData.users[1].fields.input.username },
          },
        },
      ];
      for (const body of bodyData) {
        const response = await request(app)
          .patch('/api/v1/users/updateMe')
          .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
          .send(body);
        expect(response.statusCode).toBe(
          errors.authErrors.inactiveUser.statusCode
        );
        expect(response.body.message).toBe(
          errors.authErrors.inactiveUser.message
        );
      }
    }
  );
};

exports.deletedUsertRoleCheck = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.inactiveUser.statusCode +
      ' with error message as "' +
      errors.authErrors.inactiveUser.message +
      '"',
    async () => {
      const response = await request(app)
        .get('/api/v1/users/getRole')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
      expect(response.statusCode).toBe(
        errors.authErrors.inactiveUser.statusCode
      );
      expect(response.body.message).toBe(
        errors.authErrors.inactiveUser.message
      );
    }
  );
};
