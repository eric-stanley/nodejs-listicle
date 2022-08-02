const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

exports.tokenCheck = (user_id) => {
  test('response has token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(userData.users[user_id]);
    expect(response.body.token).toBeDefined();
    process.env.JWT_TOKEN = response.body.token;
  });
};
