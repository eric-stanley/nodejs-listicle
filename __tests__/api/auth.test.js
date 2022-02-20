const db = require('../../db');
const seed = require('../../data/seed-initial-data');

const { valid, invalid } = require('./tests/signup');
const {
  statusCodeCheck,
  headerCheck,
  tokenCheck,
  inactiveUserCheck,
  unAuthorizedCheck,
  badRequestCheck,
  serverErrorCheck,
} = require('./tests/login');
const { checkAuthenticatedDelete } = require('./tests/user');

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
    describe('given a new user signup fields', valid);
    describe('given an existing user signup fields', invalid);
  });

  describe('POST /api/v1/auth/login', () => {
    describe('given the email and password', () => {
      statusCodeCheck();
      headerCheck();
      tokenCheck();
    });
    describe('when the username and password is incorrect', unAuthorizedCheck);
    describe('when the user is inactive', () => {
      checkAuthenticatedDelete();
      inactiveUserCheck();
    });
    describe('when the username and password is missing', badRequestCheck);
    describe('when an empty json object is sent in request', serverErrorCheck);
  });
});
