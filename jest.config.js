const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    'js',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  testSequencer: './__tests__/customSequencer.js',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).js'],
  verbose: true,
  forceExit: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  testTimeout: 5000,
  collectCoverage: false,
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/__tests__/api/tests/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/__tests__/api/tests/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/__tests__/api/tests/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/__tests__/api/tests/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: '<rootDir>/reports/coverage/',
  coverageReporters: ['html', 'text'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  reporters: [
    'default',
    // 'jest-progress-bar-reporter',
    [
      'jest-stare',
      {
        resultDir: 'reports/jest-stare',
        reportTitle: 'jest-stare!',
        additionalResultsProcessors: ['jest-junit'],
        coverageLink: '../coverage/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: './reports/jest-html-reporters',
        filename: 'report.html',
        openReport: false,
      },
    ],
  ],
  projects: [
    {
      rootDir: '<rootDir>/__tests__/unit',
      displayName: 'unit',
      testMatch: ['**/unit/*.test.js'],
    },
    {
      rootDir: '<rootDir>/__tests__/api',
      displayName: 'api',
      testMatch: ['**/api/*.test.js'],
    },
    {
      rootDir: '<rootDir>/__tests__/e2e',
      displayName: 'e2e',
      testMatch: ['**/e2e/*.test.js'],
    },
  ],
};
