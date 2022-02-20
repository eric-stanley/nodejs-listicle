const db = require('../../db');
const seed = require('../../data/seed-initial-data');

const { valid } = require('./tests/signup');
const {
  deletedUsertRoleCheck,
  checkDeletedUserUpdate,
  checkAuthenticatedDelete,
} = require('./tests/user');

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
    describe('given the email and password', valid);
  });

  describe('DELETE /api/v1/users/deleteMe', () => {
    describe('when the user with default role tries to delete account', () => {
      checkAuthenticatedDelete();
    });
  });

  describe('GET /api/v1/users/getRole', () => {
    describe('when the user tries to get the default role', () => {
      checkDeletedUserUpdate();
      deletedUsertRoleCheck();
    });
  });
});
