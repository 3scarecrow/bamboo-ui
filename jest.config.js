module.exports = {
  bail: 1,
  verbose: true,
  testEnvironment: 'jsdom',
  testURL: 'https://jest.test',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/packages/**/__test__/*.test.{js,ts}'],
  transform: {
    "^.+\\.js?$": "babel-jest", // Adding this line solved the issue
    // "^.+\\.ts?$": "ts-jest"
  },
  collectCoverageFrom: [
      '<rootDir>/packages/**/*.{js,ts}',
      '!<rootDir>/packages/weui-wxss/**',
      '!**/__test__/**'
  ],
  snapshotSerializers: ['miniprogram-simulate/jest-snapshot-plugin']
}
