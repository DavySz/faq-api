module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/protocols/**',
    '!<rootDir>/src/domain/**/*.ts',
    '!<rootDir>/src/**/*-protocols.ts'

  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
