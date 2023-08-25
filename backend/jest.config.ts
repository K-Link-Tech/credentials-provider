import type { Config } from '@jest/types';

const config: Config.InitialOptions =  {
  preset: 'test-jest',
  testEnvironment: 'node',
  verbose: true
}

export default config;