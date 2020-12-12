module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [
    '../'
  ],
  setupFiles: ['dotenv/config'],
  testRegex: '/*.spec.ts?$',
};
