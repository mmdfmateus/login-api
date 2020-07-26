module.exports = {
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**.js', '!**/src/main/**/env.js'],
  preset: '@shelf/jest-mongodb'
};
