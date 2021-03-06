const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

exports.valid = (user_id) => {
  test('should respond with a 201 status code with token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData.users[user_id]);
    expect(response.statusCode).toBe(201);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(response.body.token).toBeDefined();
    process.env.JWT_TOKEN = response.body.token;
  });
};

exports.checkUserIdIncrement = (id1, id2) => {
  test('should increase user id by 1 for each signup', async () => {
    let response = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData.users[id1]);
    expect(response.statusCode).toBe(201);
    const user_id = response.body.data.user.user_id;
    expect(response.body.token).toBeDefined();

    response = await request(app)
      .post('/api/v1/auth/signup')
      .send(userData.users[id2]);
    expect(response.statusCode).toBe(201);
    expect(user_id + 1).toBe(response.body.data.user.user_id);
  });
};
