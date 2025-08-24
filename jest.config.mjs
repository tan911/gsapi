import { createDefaultPreset } from 'ts-jest'
import { pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json' with { type: 'json' }

const alias = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
})

// const tsJestTransformCfg = createDefaultPreset().transform

const config = {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    transform: {
        // ...tsJestTransformCfg,
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    transformIgnorePatterns: ['/node_modules/(?!(jose|better-auth)/)'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/tests/**/*.test.ts'],
    // setupFiles: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/prisma/(.*)$': '<rootDir>/prisma/$1',
        ...alias,
    },
}

export default config
