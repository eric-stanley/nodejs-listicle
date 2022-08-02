const request = require('supertest');
const app = require('../../../app');
const randomData = require('../../data/random.data');

let environments = [];

exports.createMultipleEnvironmentsCheck = (numOfEnvironments) => {
  let i = 0;
  let current_environment_id;

  environments = randomData.getRandomString(
    numOfEnvironments,
    'description',
    5
  );

  jest.retryTimes(4);
  test.each(environments)(
    'should respond with a 201 status code with the new environment that is created',
    async (fields) => {
      const previous_environment_id = current_environment_id;
      const response = await request(app)
        .post('/api/v1/environments')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(fields);
      expect(response.statusCode).toBe(201);

      current_environment_id = response.body.data.data.env_id;
      fields.fields.input.id = current_environment_id;

      if (i >= 1) {
        expect(previous_environment_id).toBe(current_environment_id - 1);
      }
      expect(response.body.data.data.description).toEqual(
        fields.fields.input.description
      );
      i += 1;
    }
  );
};

exports.updateMultipleEnvironmentsCheck = () => {
  jest.retryTimes(4);
  test.each(environments)(
    'should respond with a 200 status code with the environment that is updated',
    async (fields) => {
      const current_environment = randomData.getRandomString(
        1,
        'description',
        5
      )[0];
      const response = await request(app)
        .patch('/api/v1/environments/' + fields.fields.input.id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(current_environment);
      expect(response.statusCode).toBe(200);

      expect(response.body.data.data.description).toEqual(
        current_environment.fields.input.description
      );
    }
  );
};
