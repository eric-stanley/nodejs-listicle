const request = require('supertest');
const app = require('../../../app');
const randomData = require('../../data/random.data');

let priorities = [];

exports.createMultiplePrioritiesCheck = (numOfPriorities) => {
  let i = 0;
  let current_priority_id;

  priorities = randomData.getRandomString(numOfPriorities, 'description', 5);

  jest.retryTimes(4);
  test.each(priorities)(
    'should respond with a 201 status code with the new priority that is created',
    async (fields) => {
      const previous_priority_id = current_priority_id;
      const response = await request(app)
        .post('/api/v1/priorities')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(fields);
      expect(response.statusCode).toBe(201);

      current_priority_id = response.body.data.data.priority_id;
      fields.fields.input.id = current_priority_id;

      if (i >= 1) {
        expect(previous_priority_id).toBe(current_priority_id - 1);
      }
      expect(response.body.data.data.description).toEqual(
        fields.fields.input.description
      );
      i += 1;
    }
  );
};

exports.updateMultiplePrioritiesCheck = () => {
  jest.retryTimes(4);
  test.each(priorities)(
    'should respond with a 200 status code with the priority that is updated',
    async (fields) => {
      const current_priority = randomData.getRandomString(
        1,
        'description',
        5
      )[0];
      const response = await request(app)
        .patch('/api/v1/priorities/' + fields.fields.input.id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(current_priority);
      expect(response.statusCode).toBe(200);

      expect(response.body.data.data.description).toEqual(
        current_priority.fields.input.description
      );
    }
  );
};
