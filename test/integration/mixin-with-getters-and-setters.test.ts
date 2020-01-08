import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Mixins with getters and setters', () => {
	forEachSettings(() => {
		it('should copy props correctly when the prototype has a getter/setter', () => {
			let externalValue = 0;

			class Base {}
			class HasGetter {
				public get externalValue() {
					return externalValue;
				}
			}

			const Mixed = Mixin(Base, HasGetter);

			let hg = new HasGetter();
			let mx = new Mixed();

			expect(hg.externalValue).to.equal(0);
			expect(mx.externalValue).to.equal(0);

			externalValue ++;

			expect(hg.externalValue).to.equal(1);
			expect(mx.externalValue).to.equal(1);
		});
	});
});
