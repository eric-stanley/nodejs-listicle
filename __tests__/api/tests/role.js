const request = require('supertest');
const app = require('../../../app');

exports.getAllRolesCheck = () => {
  test('should respond with a 200 status code with all 8 roles', async () => {
    const bodyData = [
      {
        fields: {
          select: 'description',
        },
      },
      {
        fields: {},
      },
    ];

    for (const body of bodyData) {
      const response = await request(app)
        .get('/api/v1/roles')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toBe(8);
    }
  });
};

exports.getAllRolesServerError = () => {
  test('should respond with a 500 status code', async () => {
    const bodyData = [{}];

    for (const body of bodyData) {
      const response = await request(app)
        .get('/api/v1/roles')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(500);
    }
  });
};

exports.getOneRoleCheck = (role_id, description) => {
  test(
    'should respond with a 200 status code with the role id ' +
      role_id +
      ' and description as ' +
      description,
    async () => {
      const response = await request(app)
        .get('/api/v1/roles/' + role_id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.data.description).toEqual(description);
    }
  );
};
