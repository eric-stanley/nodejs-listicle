const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');
const errors = require('../../../constants/errors');

const defaultUserRole = 'guest';

exports.checkAuthenticatedUpdate = () => {
  test('should respond with a status code of 200 if authenticated', async () => {
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
      expect(response.statusCode).toBe(200);
      expect(response.body.data.user).toMatchObject(body.fields.input);
    }
  });
};

exports.checkAuthenticatedBadUpdate = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.passwordUpdate.statusCode +
      ' with error message as "' +
      errors.authErrors.passwordUpdate.message +
      '"',
    async () => {
      const bodyData = [
        {
          fields: {
            input: { password: userData.users[1].fields.input.password },
          },
        },
        {
          fields: {
            input: {
              password_confirm: userData.users[1].fields.input.password_confirm,
            },
          },
        },
      ];
      for (const body of bodyData) {
        const response = await request(app)
          .patch('/api/v1/users/updateMe')
          .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
          .send(body);
        expect(response.statusCode).toBe(
          errors.authErrors.passwordUpdate.statusCode
        );
        expect(response.body.message).toBe(
          errors.authErrors.passwordUpdate.message
        );
      }
    }
  );
};

exports.checkUnAuthenticatedBadUpdate = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.undefinedToken.statusCode +
      ' with error message as "' +
      errors.authErrors.undefinedToken.message +
      '"',
    async () => {
      const bodyData = [
        {
          fields: {
            input: { password: userData.users[1].fields.input.password },
          },
        },
        {
          fields: {
            input: {
              password_confirm: userData.users[1].fields.input.password_confirm,
            },
          },
        },
      ];
      for (const body of bodyData) {
        const response = await request(app)
          .patch('/api/v1/users/updateMe')
          .send(body);
        expect(response.statusCode).toBe(
          errors.authErrors.undefinedToken.statusCode
        );
        expect(response.body.message).toBe(
          errors.authErrors.undefinedToken.message
        );
      }
    }
  );
};

exports.checkUnAuthenticatedUpdate = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.undefinedToken.statusCode +
      ' with error message as "' +
      errors.authErrors.undefinedToken.message +
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
          .send(body);
        expect(response.statusCode).toBe(
          errors.authErrors.undefinedToken.statusCode
        );
        expect(response.body.message).toBe(
          errors.authErrors.undefinedToken.message
        );
      }
    }
  );
};

exports.checkAuthenticatedDelete = () => {
  test('should respond with a status code of 204 if authenticated and empty response data', async () => {
    const response = await request(app)
      .delete('/api/v1/users/deleteMe')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
    expect(response.statusCode).toBe(204);
    expect(response.body).toMatchObject({});
  });
};

exports.checkUnAuthenticatedDelete = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.undefinedToken.statusCode +
      ' with error message as "' +
      errors.authErrors.undefinedToken.message +
      '"',
    async () => {
      const response = await request(app).delete('/api/v1/users/deleteMe');
      expect(response.statusCode).toBe(
        errors.authErrors.undefinedToken.statusCode
      );
      expect(response.body.message).toBe(
        errors.authErrors.undefinedToken.message
      );
    }
  );
};

exports.defaultRoleCheck = () => {
  test('response has guest role by default', async () => {
    const response = await request(app)
      .get('/api/v1/users/getRole')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
    expect(response.body.data.description).toBe(defaultUserRole);
  });
};

exports.undefinedTokenCheck = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.undefinedToken.statusCode +
      ' with error message as "' +
      errors.authErrors.undefinedToken.message +
      '"',
    async () => {
      const response = await request(app).get('/api/v1/users/getRole');
      expect(response.statusCode).toBe(
        errors.authErrors.undefinedToken.statusCode
      );
      expect(response.body.message).toBe(
        errors.authErrors.undefinedToken.message
      );
    }
  );
};
