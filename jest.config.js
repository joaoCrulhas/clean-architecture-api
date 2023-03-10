module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/vendor/**',
    '!<rootDir>/src/main/**'
  ],
  coverageReporters: ["json", "html"]

};
