import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { IsBoolean, IsIn, validate } from 'class-validator';
import { decorate, Mixin } from '../../src';

describe('gh-issue #28', () => {
	forEachSettings(() => {
		it('should work', async () => {
			class Disposable {
				@decorate(IsBoolean()) // instead of @IsBoolean()
				isDisposed: boolean = false;
			}

			class Statusable {
				@decorate(IsIn(['red', 'green'])) // instead of @IsIn(['red', 'green'])
				status: string = 'green';
			}

			class Statusable2 {
				@decorate(IsIn(['red', 'green'])) // instead of @IsIn(['red', 'green'])
				other: string = 'green';
			}

			class ExtendedObject extends Mixin(Disposable, Statusable) {
			}

			class ExtendedObject2 extends Mixin(Statusable2, ExtendedObject) {
			}

			const extendedObject = new ExtendedObject2();
			extendedObject.status = 'blue';
			extendedObject.other = 'blue';
			// @ts-ignore
			extendedObject.isDisposed = undefined;

			const errors = await validate(extendedObject);
			const errorProps = errors.map(error => error.property);
			expect(errorProps).to.contain('status');
			expect(errorProps).to.contain('other');
			expect(errorProps).to.contain('isDisposed');
		});
	});
});
