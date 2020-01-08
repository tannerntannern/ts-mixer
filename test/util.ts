import 'mocha';
import { settings, Settings } from '../src/settings';

export const forEachSettings = (runTests: () => void) => {
	const options: Settings[] = [
		{ staticsStrategy: 'copy', prototypeStrategy: 'copy' },
		{ staticsStrategy: 'copy', prototypeStrategy: 'proxy' },
		{ staticsStrategy: 'proxy', prototypeStrategy: 'copy' },
		{ staticsStrategy: 'proxy', prototypeStrategy: 'proxy' },
	];

	options.forEach(runSettings => {
		Object.assign(settings, runSettings);
		describe(`Settings: { protoStrategy: ${settings.prototypeStrategy}, staticStrategy: ${settings.staticsStrategy} }`, () => {
			runTests();
		})
	});
};
