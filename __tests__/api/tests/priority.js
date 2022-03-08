const request = require('supertest');
const app = require('../../../app');
const errors = require('../../../constants/errors');

exports.getAllPrioritiesCheck = (statusCode) => {
  test('should respond with a ' + statusCode + ' status code', async () => {
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
        .get('/api/v1/priorities')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(statusCode);
      if (statusCode === 200) {
        expect(response.body.results).toBe(3);
      } else if (statusCode === 403) {
        expect(response.body.message).toBe(
          errors.authErrors.restrictPermission.message
        );
      }
    }
  });
};

exports.getAllPrioritiesServerError = () => {
  test('should respond with a 500 status code', async () => {
    const bodyData = [{}];

    for (const body of bodyData) {
      const response = await request(app)
        .get('/api/v1/priorities')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(500);
    }
  });
};

exports.getOnePriorityCheck = (priority_id, description) => {
  test(
    'should respond with a 200 status code with the priority id ' +
      priority_id +
      ' and description as ' +
      description,
    async () => {
      const response = await request(app)
        .get('/api/v1/priorities/' + priority_id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.data.description).toEqual(description);
    }
  );
};
