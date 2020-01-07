import 'mocha';
import { expect } from 'chai';
import { mix, Mixin } from '../../src/mixins';

class Foo {
	foo = 'foo';
	method() {
		return 'foo';
	}
}

class Bar {
	bar = 'bar';
	method() {
		return 'bar';
	}
}

describe('Overriding values provided by mixin', () => {
	describe('using `extends Mixin(...)`', () => {
		class MixedWithExtends extends Mixin(Foo, Bar) {
			foo = 'not foo';
			method() {
				return 'not foo';
			}
		}

		let m = new MixedWithExtends();

		it('should prefer properties on the class over the mixed classes', () => {
			expect(m.foo).to.equal('not foo');
			expect(m.method()).to.equal('not foo');
		});
	});

	describe('using `@mix(...)`', () => {
		@mix(Foo, Bar)
		class MixedWithDecorator {
			foo = 'not foo';
			method() {
				return 'not foo';
			}
		}
		interface MixedWithDecorator extends Foo, Bar {}

		let m = new MixedWithDecorator();

		it('should prefer properties on the class over the mixed classes', () => {
			expect(m.foo).to.equal('not foo');
			expect(m.method()).to.equal('not foo');
		});
	});
});
