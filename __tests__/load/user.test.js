const db = require('../../db');
const seed = require('../../data/seed-initial-data');

const { multipleSignups, multipleLogins } = require('./tests/auth');
const numberOfSignupRequests = 20;
const numberOfLoginRequests = 20;

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
  describe('POST /api/v1/auth/signup', () => {
    describe('given ' + numberOfSignupRequests + ' signup requests', () => {
      multipleSignups(numberOfSignupRequests);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('given ' + numberOfLoginRequests + ' login requests', () => {
      multipleLogins(numberOfLoginRequests);
    });
  });
});
