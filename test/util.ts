import 'mocha';
import { settings, Settings } from '../src/settings';

export const forEachSettings = (runTests: () => void) => {
	const options: Partial<Settings>[] = [
		{ staticsStrategy: 'copy', prototypeStrategy: 'copy' },
		{ staticsStrategy: 'copy', prototypeStrategy: 'proxy' },
		{ staticsStrategy: 'proxy', prototypeStrategy: 'copy' },
		{ staticsStrategy: 'proxy', prototypeStrategy: 'proxy' },
	];

	for (let runSettings of options) {
		describe(`Settings: { proto: ${runSettings.prototypeStrategy}, static: ${runSettings.staticsStrategy} }`, () => {
			beforeEach(() => {
				Object.assign(settings, runSettings);
			});

			runTests();
		});
	}
};

export type AssertEquals<T1, T2> = T1 extends T2 ? T2 extends T1 ? true : false : false;
