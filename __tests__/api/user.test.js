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

describe('User specific test', () => {
  describe('POST /api/v1/auth/login', () => {
    describe('given a email and password', () => {
      test('response has token', async () => {
        const response = await request(app)
          .post('/api/v1/auth/signup')
          .send(userData.users[0]);
        expect(response.body.token).toBeDefined();
        process.env.JWT_TOKEN = response.body.token;
      });
    });
  });

  describe('PATCH /api/v1/users/updateMe', () => {
    describe('when the user with default role tries to update email or username', () => {
      test('should respond with a status code of 200 if authenticated', async () => {
        const bodyData = [
          {
            fields: {
              input: { email: userData.users[1].fields.input.email },
            },
          },
          {
            fields: {
              input: { username: userData.users[1].fields.input.username },
            },
          },
        ];
        for (const body of bodyData) {
          const response = await request(app)
            .patch('/api/v1/users/updateMe')
            .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`)
            .send(body);
          expect(response.statusCode).toBe(200);
          expect(response.body.data.user).toMatchObject(body.fields.input);
        }
      });

      test('should respond with a status code of 401 if unauthenticated', async () => {
        const bodyData = [
          {
            fields: {
              input: { email: userData.users[1].fields.input.email },
            },
          },
          {
            fields: {
              input: { username: userData.users[1].fields.input.username },
            },
          },
        ];
        for (const body of bodyData) {
          const response = await request(app)
            .patch('/api/v1/users/updateMe')
            .send(body);
          expect(response.statusCode).toBe(401);
        }
      });
    });
  });

  describe('DELETE /api/v1/users/deleteMe', () => {
    describe('when the user with default role tries to delete account', () => {
      test('should respond with a status code of 204 if authenticated and response data is empty', async () => {
        const response = await request(app)
          .delete('/api/v1/users/deleteMe')
          .set('Authorization', `Bearer ${process.env.JWT_TOKEN}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toMatchObject({});
      });

      test('should respond with a status code of 401 if unauthenticated', async () => {
        const response = await request(app).delete('/api/v1/users/deleteMe');
        expect(response.statusCode).toBe(401);
      });
    });
  });
});
