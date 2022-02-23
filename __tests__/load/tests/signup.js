const request = require('supertest');
const genUsername = require('unique-username-generator');
const app = require('../../../app');
const random = require('../../../utils/random');

exports.multipleSignups = (numOfSignups) => {
  const users = [];
  let i = 0;
  do {
    i += 1;
    const username = genUsername.generateUsername();
    const password = random.randomString(10);
    const user = {
      fields: {
        input: {
          username: username,
          password: password,
          password_confirm: password,
          email: username + '@test.com',
        },
      },
    };
    users.push(user);
  } while (i < numOfSignups);

  i = 0;
  let current_user_id;

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
