const { setupDB } = require('../testSetup');

const {
  createMultiplePrioritiesCheck,
  updateMultiplePrioritiesCheck,
} = require('./tests/priority');
const { tokenCheck } = require('./tests/login');
const numberOfPrioritiesToAdd = (numberOfPrioritiesToUpdate = 15);

setupDB();

describe('Priority specific test', () => {
  describe('POST /api/v1/priorities', () => {
    describe('given administrator email and password', () => {
      tokenCheck(3);
    });
    describe(
      'given ' + numberOfPrioritiesToAdd + ' priority creation requests',
      () => {
        createMultiplePrioritiesCheck(numberOfPrioritiesToAdd);
      }
    );
  });

  describe('PATCH /api/v1/priorities', () => {
    describe(
      'given ' + numberOfPrioritiesToUpdate + ' priority updation requests',
      () => {
        updateMultiplePrioritiesCheck();
      }
    );
  });
});
