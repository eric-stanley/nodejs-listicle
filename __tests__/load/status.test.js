const { setupDB } = require('../testSetup');

const {
  createMultipleStatusesCheck,
  updateMultipleStatusesCheck,
} = require('./tests/status');
const { tokenCheck } = require('./tests/login');
const numberOfStatusesToAdd = (numberOfStatusesToUpdate = 15);

setupDB();

describe('Status specific test', () => {
  describe('POST /api/v1/status', () => {
    describe('given administrator email and password', () => {
      tokenCheck(3);
    });
    describe(
      'given ' + numberOfStatusesToAdd + ' status creation requests',
      () => {
        createMultipleStatusesCheck(numberOfStatusesToAdd);
      }
    );
  });

  describe('PATCH /api/v1/status', () => {
    describe(
      'given ' + numberOfStatusesToUpdate + ' status updation requests',
      () => {
        updateMultipleStatusesCheck();
      }
    );
  });
});
