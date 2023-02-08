import 'mocha';
import { expect } from 'chai';
import { forEachSettings, AssertEquals } from '../util';

import { Mixin, hasMixin } from '../../src';

describe('hasMixin(...)', () => {
	class Foo {}
	class Bar {}
	class FooBar extends Mixin(Foo, Bar) {}
	const fooBar: any = new FooBar();

	forEachSettings(() => {
		it('should have the proper type narrowing', () => {
			if (hasMixin(fooBar, FooBar)) {
				const test: AssertEquals<typeof fooBar, FooBar> = true;
			}
		});

		it('should work as a replacement for `instanceof`', () => {
			expect(hasMixin(fooBar, FooBar)).to.be.true;
		});

		it('should work for constituents', () => {
			expect(hasMixin(fooBar, Foo)).to.be.true;
			expect(hasMixin(fooBar, Bar)).to.be.true;
		});

		it('should work with abstract classes', () => {
			abstract class Baz {}
			class FooBaz extends Mixin(Foo, Baz) {}
			const fooBaz: any = new FooBaz();
			expect(hasMixin(fooBaz, Baz)).to.be.true;
		});

		it('should work for cases where the mixin is buried deep in the proto chain', () => {
			class Foo1 {}
			class Bar1 {}
			class FooBar1 extends Mixin(Foo1, Bar1) {}
			class Baz1 extends FooBar1 {}

			class Foo2 {}
			class Bar2 {}
			class FooBar2 extends Mixin(Foo2, Bar2) {}
			class Baz2 extends FooBar2 {}

			class SuperFooBar extends Mixin(Baz1, Baz2) {}
			class ExtraLayerJustForFun extends SuperFooBar {}
			class NonRelatedClassJustAsASanityCheck {}

			const instance: any = new ExtraLayerJustForFun();

			expect(hasMixin(instance, NonRelatedClassJustAsASanityCheck)).to.be.false;
			expect(instance instanceof Foo1).to.be.false;

			expect(hasMixin(instance, Foo1)).to.be.true;
			expect(hasMixin(instance, Bar1)).to.be.true;
			expect(hasMixin(instance, Baz1)).to.be.true;
			expect(hasMixin(instance, Baz2)).to.be.true;
			expect(hasMixin(instance, Baz2)).to.be.true;
			expect(hasMixin(instance, Baz2)).to.be.true;
		});
	});
});
