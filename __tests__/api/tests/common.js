const request = require('supertest');
const app = require('../../../app');
const userData = require('../../data/user.data');

exports.chechUndefinedId = (user_id, path, statusCode) => {
  test(
    'should respond with a ' + statusCode + ' status code with no id or _id',
    async () => {
      const response = await request(app)
        .post(path)
        .send(userData.users[user_id]);
      expect(response.statusCode).toBe(statusCode);
      expect(response.body.data.user.id).toBeUndefined();
      expect(response.body.data.user._id).toBeUndefined();
    }
  );
};
