module.exports = {
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**.js'],
  preset: '@shelf/jest-mongodb'
};
