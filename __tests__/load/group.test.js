const { setupDB } = require('../testSetup');

const {
  createMultipleGroupsCheck,
  updateMultipleGroupsCheck,
} = require('./tests/group');
const { tokenCheck } = require('./tests/login');
const numberOfGroupsToAdd = (numberOfGroupsToUpdate = 15);

setupDB();

describe('Group specific test', () => {
  describe('POST /api/v1/groups', () => {
    describe('given administrator email and password', () => {
      tokenCheck(3);
    });
    describe(
      'given ' + numberOfGroupsToAdd + ' group creation requests',
      () => {
        createMultipleGroupsCheck(numberOfGroupsToAdd);
      }
    );
  });

  describe('PATCH /api/v1/groups', () => {
    describe(
      'given ' + numberOfGroupsToUpdate + ' group updation requests',
      () => {
        updateMultipleGroupsCheck();
      }
    );
  });
});
