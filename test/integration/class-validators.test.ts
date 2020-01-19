import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { IsBoolean, IsIn, validate } from 'class-validator';
import { Mixin } from '../../src';

describe('gh-issue #15', () => {
	forEachSettings(() => {
		class Disposable {
			@IsBoolean()
			isDisposed: boolean = false;
		}

		class Statusable {
			@IsIn(['bound', 'open'])
			status: string = 'test';
		}

		class ExtendedObject extends Mixin(Disposable, Statusable) {}

		it('should inherit class-validators properly', async () => {
			const extendedObject = new ExtendedObject();

			const errors = await validate(extendedObject);

			expect(errors.length).to.not.equal(0);
		});
	});
});
