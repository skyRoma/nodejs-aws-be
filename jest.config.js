module.exports = {
  transform: { '.ts': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      diagnostics: {
        pathRegex: '(.*?\\.spec)\\.ts$',
      },
    },
  },
};
