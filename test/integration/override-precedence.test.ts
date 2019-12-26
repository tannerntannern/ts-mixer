import 'mocha';
import {expect} from 'chai';
import {mix, Mixin} from '../../src/mixins';

class MixinA {
	foo = 'a';
	method() {
		return 'method from A';
	}
}

class MixinB {
	foo = 'b';
	method() {
		return 'method from B';
	}
}

describe('Overriding values provided by mixin', () => {
	describe('using `extends Mixin(...)`', () => {
		class MixedWithExtends extends Mixin(MixinA, MixinB) {
			foo = 'mixed';
			method() {
				return 'method from Mixed';
			}
		}

		let m = new MixedWithExtends();

		it('should prefer properties on the class over the mixed classes', () => {
			expect(m.foo).to.equal('mixed');
			expect(m.method()).to.equal('method from Mixed');
		});
	});

	describe('using `@mix(...)`', () => {
		@mix(MixinA, MixinB)
		class MixedWithDecorator {
			foo = 'mixed';
			method() {
				return 'method from Mixed';
			}
		}
		interface MixedWithDecorator extends MixinA, MixinB {}

		let m = new MixedWithDecorator();

		it('should prefer properties on the class over the mixed classes', () => {
			expect(m.foo).to.equal('mixed');
			expect(m.method()).to.equal('method from Mixed');
		});
	});
});
