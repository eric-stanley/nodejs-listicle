const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeAll(() => {
  db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

test('should signup a new user', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      fields: {
        input: {
          username: 'fuzzyspuffy',
          password: 'EnoB6533+',
          password_confirm: 'EnoB6533+',
          email: 'fuzzyspuffy@test.com',
        },
      },
    })
    .expect(201);
});

test('should login an existing user', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      fields: {
        input: {
          password: 'EnoB6533+',
          email: 'fuzzyspuffy@test.com',
        },
      },
    })
    .expect(200);
});
