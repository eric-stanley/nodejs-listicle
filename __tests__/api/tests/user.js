const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

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

exports.checkUnAuthenticatedUpdate = () => {
  test('should respond with a status code of 401 if unauthenticated', async () => {
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
      expect(response.statusCode).toBe(401);
    }
  });
};

exports.checkAuthenticatedDelete = () => {
  test('should respond with a status code of 204 if authenticated and response data is empty', async () => {
    const response = await request(app)
      .delete('/api/v1/users/deleteMe')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
    expect(response.statusCode).toBe(204);
    expect(response.body).toMatchObject({});
  });
};

exports.checkUnAuthenticatedDelete = () => {
  test('should respond with a status code of 401 if unauthenticated', async () => {
    const response = await request(app).delete('/api/v1/users/deleteMe');
    expect(response.statusCode).toBe(401);
  });
};
