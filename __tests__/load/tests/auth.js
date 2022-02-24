const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

let users = [];

exports.multipleSignups = (numOfSignups) => {
  i = 0;
  let current_user_id;
  users = userData.getRandomUsers(numOfSignups);

  jest.retryTimes(4);
  test.each(users)(
    'should increase user id by 1 for each signup',
    async (fields) => {
      const previous_user_id = current_user_id;
      let response = await request(app)
        .post('/api/v1/auth/signup')
        .send(fields);
      expect(response.statusCode).toBe(201);
      current_user_id = response.body.data.user.user_id;
      if (i >= 1) {
        expect(previous_user_id).toBe(current_user_id - 1);
      }
      expect(response.body.token).toBeDefined();
      i += 1;
    }
  );
};

exports.multipleLogins = (numOfLogins) => {
  i = 0;

  jest.retryTimes(4);
  test.each(users)(
    'should respond with a 200 status code with token',
    async (fields) => {
      let response = await request(app).post('/api/v1/auth/login').send(fields);
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      i += 1;
    }
  );
};
