const request = require('supertest');
const app = require('../../../app');
const roleData = require('../../data/role.data');

let roles = [];

exports.createMultipleRolesCheck = (numOfRoles) => {
  let i = 0;
  let current_role_id;

  roles = roleData.getRandomRoles(numOfRoles);

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
