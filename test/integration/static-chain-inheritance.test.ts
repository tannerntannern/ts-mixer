import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Static chain inheritance', () => {
	forEachSettings(() => {
		class TEST0 {
			static scope = 10;
		}
		class TEST1 extends TEST0 {}
		class TEST2 extends Mixin(TEST1) {}

		it('should inherit static properties correctly in an A extends B extends C scenario', () => {
			expect(TEST2.scope).to.equal(10);
		});
	});
});
