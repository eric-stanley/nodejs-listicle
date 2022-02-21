const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');
const errors = require('../../../constants/errors');

exports.statusCodeCheck = () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(userData.users[0]);
    expect(response.statusCode).toBe(200);
  });
};

exports.headerCheck = () => {
  test('should specify json in the content type header', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(userData.users[0]);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });
};

exports.tokenCheck = () => {
  test('response has token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(userData.users[0]);
    expect(response.body.token).toBeDefined();
    process.env.JWT_TOKEN = response.body.token;
  });
};

exports.badRequestCheck = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.undefinedEmailPassword.statusCode +
      ' with error message as "' +
      errors.authErrors.undefinedEmailPassword.message +
      '"',
    async () => {
      const bodyData = [
        {
          fields: {
            input: { email: userData.users[0].fields.input.email },
          },
        },
        {
          fields: {
            input: { password: userData.users[0].fields.input.password },
          },
        },
        { fields: { input: {} } },
      ];
      for (const body of bodyData) {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(body);
        expect(response.statusCode).toBe(
          errors.authErrors.undefinedEmailPassword.statusCode
        );
        expect(response.body.message).toBe(
          errors.authErrors.undefinedEmailPassword.message
        );
      }
    }
  );
};

exports.unAuthorizedCheck = () => {
  test(
    'should respond with a status code of ' +
      errors.authErrors.incorrectEmailPassword.statusCode +
      ' with error message as "' +
      errors.authErrors.incorrectEmailPassword.message +
      '"',
    async () => {
      const body = {
        fields: {
          input: {
            email: userData.users[0].fields.input.email,
            password: userData.users[1].fields.input.password,
          },
        },
      };
      const response = await request(app).post('/api/v1/auth/login').send(body);
      expect(response.statusCode).toBe(
        errors.authErrors.incorrectEmailPassword.statusCode
      );
      expect(response.body.message).toBe(
        errors.authErrors.incorrectEmailPassword.message
      );
    }
  );
};

exports.inactiveUserCheck = () => {
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

exports.serverErrorCheck = () => {
  test('should respond with a status code of 500', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({});
    expect(response.statusCode).toBe(500);
  });
};
