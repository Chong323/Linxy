module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
    'expo-secure-store': '<rootDir>/__mocks__/expo-secure-store.ts',
    '^expo-av$': '<rootDir>/__mocks__/expo-av.ts',
    '^@react-native-voice/voice$': '<rootDir>/__mocks__/@react-native-voice/voice.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((react-native.*)|@react-navigation/.*|expo-.*|@expo/.*)/)',
  ],
};
