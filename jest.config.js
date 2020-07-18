module.exports = {
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js'],
  preset: '@shelf/jest-mongodb'
};
