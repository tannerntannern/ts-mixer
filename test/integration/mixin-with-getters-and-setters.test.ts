import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

describe('Mixins with getters and setters', () => {
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
