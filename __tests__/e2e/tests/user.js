const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

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
  test('should respond with a status code of 401 if user is deleted for an active token', async () => {
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
      expect(response.statusCode).toBe(401);
    }
  });
};

exports.deletedUsertRoleCheck = () => {
  test('response has status code of 401 if the user is deleted and token is active', async () => {
    const response = await request(app)
      .get('/api/v1/users/getRole')
      .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
    expect(response.statusCode).toBe(401);
  });
};
