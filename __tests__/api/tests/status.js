const request = require('supertest');
const app = require('../../../app');
const errors = require('../../../constants/errors');

exports.getAllStatusesCheck = (statusCode) => {
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
        .get('/api/v1/status')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(statusCode);
      if (statusCode === 200) {
        expect(response.body.results).toBe(4);
      } else if (statusCode === 403) {
        expect(response.body.message).toBe(
          errors.authErrors.restrictPermission.message
        );
      }
    }
  });
};

exports.getAllStatusesServerError = () => {
  test('should respond with a 500 status code', async () => {
    const bodyData = [{}];

    for (const body of bodyData) {
      const response = await request(app)
        .get('/api/v1/status')
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
        .send(body);
      expect(response.statusCode).toBe(500);
    }
  });
};

exports.getOneStatusCheck = (status_id, description) => {
  test(
    'should respond with a 200 status code with the status id ' +
      status_id +
      ' and description as ' +
      description,
    async () => {
      const response = await request(app)
        .get('/api/v1/status/' + status_id)
        .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data.data.description).toEqual(description);
    }
  );
};
