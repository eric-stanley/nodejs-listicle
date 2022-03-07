const { setupDB } = require('../testSetup');

const {
  createMultipleRolesCheck,
  updateMultipleRolesCheck,
} = require('./tests/role');
const { tokenCheck } = require('./tests/login');
const numberOfRolesToAdd = (numberOfRolesToUpdate = 15);

setupDB();

describe('Role specific test', () => {
  describe('POST /api/v1/roles', () => {
    describe('given administrator email and password', () => {
      tokenCheck(3);
    });
    describe('given ' + numberOfRolesToAdd + ' role creation requests', () => {
      createMultipleRolesCheck(numberOfRolesToAdd);
    });
  });

  describe('PATCH /api/v1/roles', () => {
    describe(
      'given ' + numberOfRolesToUpdate + ' role updation requests',
      () => {
        updateMultipleRolesCheck();
      }
    );
  });
});
