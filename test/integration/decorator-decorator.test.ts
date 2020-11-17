import 'mocha';
import { expect } from 'chai';

import { IsBoolean, IsIn, validate } from 'class-validator';
import { decorate, Mixin } from '../../src';

describe('@decorator(...)', () => {
	xit('should work', async () => {
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

		class ExtendedObject extends Mixin(Disposable, Statusable) {}

		class ExtendedObject2 extends Mixin(Statusable2, ExtendedObject) {}

		const extendedObject = new ExtendedObject2();
		extendedObject.status = 'blue';
		extendedObject.other = 'blue';
		extendedObject.isDisposed = undefined;

		console.log(await validate(extendedObject));
	});
});
