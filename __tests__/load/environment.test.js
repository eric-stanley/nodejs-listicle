const { setupDB } = require('../testSetup');

const {
  createMultipleEnvironmentsCheck,
  updateMultipleEnvironmentsCheck,
} = require('./tests/environment');
const { tokenCheck } = require('./tests/login');
const numberOfEnvironmentsToAdd = (numberOfEnvironmentsToUpdate = 15);

setupDB();

describe('Environment specific test', () => {
  describe('POST /api/v1/environments', () => {
    describe('given administrator email and password', () => {
      tokenCheck(3);
    });
    describe(
      'given ' + numberOfEnvironmentsToAdd + ' priority creation requests',
      () => {
        createMultipleEnvironmentsCheck(numberOfEnvironmentsToAdd);
      }
    );
  });

  describe('PATCH /api/v1/environments', () => {
    describe(
      'given ' +
        numberOfEnvironmentsToUpdate +
        ' environment updation requests',
      () => {
        updateMultipleEnvironmentsCheck();
      }
    );
  });
});
