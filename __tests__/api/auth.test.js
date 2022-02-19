const request = require('supertest');

const db = require('../../db');
const seed = require('../../dev-data/seed-initial-data');
const app = require('../../app');
const userData = require('../data/user.data');

beforeAll(async () => {
  await db.connect();
  await seed.deleteData();
  await seed.importData();
});

afterAll(async () => {
  await seed.deleteData();
  await db.disconnect();
});

describe('Authentication test', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('given a new user signup fields', () => {
      test('should respond with a 201 status code', async () => {
        const response = await request(app)
          .post('/api/v1/auth/signup')
          .send(userData.users[0]);
        expect(response.statusCode).toBe(201);
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });
    });

    describe('given an existing user signup fields', () => {
      test('should respond with a 400 status code with content type as json', async () => {
        const response = await request(app)
          .post('/api/v1/auth/signup')
          .send(userData.users[0]);
        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('given a email and password', () => {
      test('should respond with a 200 status code', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(userData.users[0]);
        expect(response.statusCode).toBe(200);
      });
      test('should specify json in the content type header', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(userData.users[0]);
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });
      test('response has token', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(userData.users[0]);
        expect(response.body.token).toBeDefined();
        process.env.JWT_TOKEN = response.body.token;
      });
    });

    describe('when the username and password is missing', () => {
      test('should respond with a status code of 400', async () => {
        const bodyData = [
          {
            fields: {
              input: { email: userData.users[0].fields.input.email },
            },
          },
          {
            fields: {
              input: { password: userData.users[0].fields.input.password },
            },
          },
          { fields: { input: {} } },
        ];
        for (const body of bodyData) {
          const response = await request(app)
            .post('/api/v1/auth/login')
            .send(body);
          expect(response.statusCode).toBe(400);
        }
      });
    });

    describe('when an empty json object is sent in request', () => {
      test('should respond with a status code of 500', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({});
        expect(response.statusCode).toBe(500);
      });
    });
  });
});
