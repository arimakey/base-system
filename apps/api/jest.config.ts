export default {
	displayName: 'api',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': [
			'ts-jest',
			{ tsconfig: '<rootDir>/tsconfig.spec.json' },
		],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/apps/api',
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	collectCoverageFrom: [
	  './src/**/*.ts',
	  '!./src/main.ts',
	  '!./src/**/*.module.ts',
	  '!./src/**/*.entity.ts',
	  '!./src/app/tasks/dto/*.ts',
	],
	testMatch: ['**/tests/**/*.spec.ts'],
};
