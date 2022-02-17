const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeAll(() => {
  db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

const newUser = {
  fields: {
    input: {
      username: 'fuzzyspuffy',
      password: 'EnoB6533+',
      password_confirm: 'EnoB6533+',
      email: 'fuzzyspuffy@test.com',
    },
  },
};

const user = {
  fields: {
    input: {
      password: 'EnoB6533+',
      email: 'fuzzyspuffy@test.com',
    },
  },
};

describe('POST /api/v1/auth/signup', () => {
  describe('given a new user signup fields', () => {
    test('should respond with a 201 status code', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(newUser);
      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('given an existing user signup fields', () => {
    test('should respond with a 500 status code', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(newUser);
      expect(response.statusCode).toBe(500);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

describe('POST /api/v1/auth/login', () => {
  describe('given a email and password', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).post('/api/v1/auth/login').send(user);
      expect(response.statusCode).toBe(200);
    });
    test('should specify json in the content type header', async () => {
      const response = await request(app).post('/api/v1/auth/login').send(user);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
    test('response has token', async () => {
      const response = await request(app).post('/api/v1/auth/login').send(user);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('when the username and password is missing', () => {
    test('should respond with a status code of 400', async () => {
      const bodyData = [
        { fields: { input: { email: 'email' } } },
        { fields: { input: { password: 'password' } } },
        { fields: { input: {} } },
      ];
      for (const body of bodyData) {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test('should respond with a status code of 500', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({});
      expect(response.statusCode).toBe(500);
    });
  });
});
