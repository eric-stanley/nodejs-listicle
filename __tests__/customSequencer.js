const Sequencer = require('@jest/test-sequencer').default;

const isEndToEnd = (test) => {
  const contextConfig = test.context.config;
  return contextConfig.displayName.name === 'e2e';
};

const isUnit = (test) => {
  const contextConfig = test.context.config;
  return contextConfig.displayName.name === 'unit';
};

const isApi = (test) => {
  const contextConfig = test.context.config;
  return contextConfig.displayName.name === 'api';
};

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    const unitTests = copyTests.filter((t) => isUnit(t));
    const apiTests = copyTests.filter((t) => isApi(t));
    const endToEndTests = copyTests.filter((t) => isEndToEnd(t));
    return super
      .sort(unitTests)
      .concat(apiTests.sort((a, b) => (a.path > b.path ? 1 : -1)))
      .concat(endToEndTests.sort((a, b) => (a.path > b.path ? 1 : -1)));
  }
}

module.exports = CustomSequencer;
