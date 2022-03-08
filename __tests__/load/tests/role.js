const request = require('supertest');
const app = require('../../../app');
const randomData = require('../../data/random.data');

let roles = [];

exports.createMultipleRolesCheck = (numOfRoles) => {
  let i = 0;
  let current_role_id;

  roles = randomData.getRandomString(numOfRoles, 'description', 5);

  jest.retryTimes(4);
  test.each(roles)(
    'should respond with a 201 status code with the new role that is created',
    async (fields) => {
      const previous_role_id = current_role_id;
      const response = await request(app)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(fields);
      expect(response.statusCode).toBe(201);

      current_role_id = response.body.data.data.role_id;
      fields.fields.input.id = current_role_id;

      if (i >= 1) {
        expect(previous_role_id).toBe(current_role_id - 1);
      }
      expect(response.body.data.data.description).toEqual(
        fields.fields.input.description
      );
      i += 1;
    }
  );
};

exports.updateMultipleRolesCheck = () => {
  jest.retryTimes(4);
  test.each(roles)(
    'should respond with a 200 status code with the new role that is updated',
    async (fields) => {
      const current_role = randomData.getRandomString(1, 'description', 5)[0];
      const response = await request(app)
        .patch('/api/v1/roles/' + fields.fields.input.id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(current_role);
      expect(response.statusCode).toBe(200);

      expect(response.body.data.data.description).toEqual(
        current_role.fields.input.description
      );
    }
  );
};
