module.exports = {
  testSequencer: './__tests__/customSequencer.js',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.js'],
  verbose: true,
  forceExit: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  testTimeout: 3000,
  projects: [
    {
      rootDir: '<rootDir>/__tests__/unit',
      displayName: 'unit',
    },
    {
      rootDir: '<rootDir>/__tests__/api',
      displayName: 'api',
    },
    {
      rootDir: '<rootDir>/__tests__/e2e',
      displayName: 'e2e',
    },
  ],
};
