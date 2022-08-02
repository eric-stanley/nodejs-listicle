const request = require('supertest');
const app = require('../../../app');
const randomData = require('../../data/random.data');

let groups = [];

exports.createMultipleGroupsCheck = (numOfGroups) => {
  let i = 0;
  let current_group_id;

  groups = randomData.getRandomString(numOfGroups, 'description', 5);

  jest.retryTimes(4);
  test.each(groups)(
    'should respond with a 201 status code with the new group that is created',
    async (fields) => {
      const previous_group_id = current_group_id;
      const response = await request(app)
        .post('/api/v1/groups')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(fields);
      expect(response.statusCode).toBe(201);

      current_group_id = response.body.data.data.group_id;
      fields.fields.input.id = current_group_id;

      if (i >= 1) {
        expect(previous_group_id).toBe(current_group_id - 1);
      }
      expect(response.body.data.data.description).toEqual(
        fields.fields.input.description
      );
      i += 1;
    }
  );
};

exports.updateMultipleGroupsCheck = () => {
  jest.retryTimes(4);
  test.each(groups)(
    'should respond with a 200 status code with the group that is updated',
    async (fields) => {
      const current_group = randomData.getRandomString(1, 'description', 5)[0];
      const response = await request(app)
        .patch('/api/v1/groups/' + fields.fields.input.id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(current_group);
      expect(response.statusCode).toBe(200);

      expect(response.body.data.data.description).toEqual(
        current_group.fields.input.description
      );
    }
  );
};
