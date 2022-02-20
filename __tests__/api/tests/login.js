const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

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

exports.unauthorizedCheck = () => {
  test('should respond with a status code of 400', async () => {
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
      const response = await request(app).post('/api/v1/auth/login').send(body);
      expect(response.statusCode).toBe(400);
    }
  });
};

exports.serverErrorCheck = () => {
  test('should respond with a status code of 500', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({});
    expect(response.statusCode).toBe(500);
  });
};
