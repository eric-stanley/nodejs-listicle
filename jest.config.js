module.exports = {
  testSequencer: './__tests__/customSequencer.js',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  verbose: true,
  forceExit: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  testTimeout: 3000,
  collectCoverage: true,
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
  reporters: [
    'default',
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
