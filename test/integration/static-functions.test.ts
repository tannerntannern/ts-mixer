import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Static functions', () => {
	forEachSettings(() => {
		class ClassA {
			static staticFunction() {
				return 'A';
			}
		}

		class ClassB extends Mixin(ClassA) {}

		// Note: the reason this test exists is because static functions aren't enumerable, unlike non-function static props
		it('should inherit static functions properly', () => {
			expect(ClassB.staticFunction()).to.equal('A');
		});
	});
});
