const request = require('supertest');
const app = require('../../../app');
const randomData = require('../../data/random.data');

let statuses = [];

exports.createMultipleStatusesCheck = (numOfStatuses) => {
  let i = 0;
  let current_status_id;

  statuses = randomData.getRandomString(numOfStatuses, 'description', 5);

  jest.retryTimes(4);
  test.each(statuses)(
    'should respond with a 201 status code with the new status that is created',
    async (fields) => {
      const previous_status_id = current_status_id;
      const response = await request(app)
        .post('/api/v1/status')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(fields);
      expect(response.statusCode).toBe(201);

      current_status_id = response.body.data.data.status_id;
      fields.fields.input.id = current_status_id;

      if (i >= 1) {
        expect(previous_status_id).toBe(current_status_id - 1);
      }
      expect(response.body.data.data.description).toEqual(
        fields.fields.input.description
      );
      i += 1;
    }
  );
};

exports.updateMultipleStatusesCheck = () => {
  jest.retryTimes(4);
  test.each(statuses)(
    'should respond with a 200 status code with the new status that is updated',
    async (fields) => {
      const current_status = randomData.getRandomString(1, 'description', 5)[0];
      const response = await request(app)
        .patch('/api/v1/status/' + fields.fields.input.id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(current_status);
      expect(response.statusCode).toBe(200);

      expect(response.body.data.data.description).toEqual(
        current_status.fields.input.description
      );
    }
  );
};
