import 'mocha';
import { expect } from 'chai';
import { fake, assert } from 'sinon';

import { Mixin } from '../../src';
import { decorate, getDecoratorsForClass, deepDecoratorSearch } from '../../src/decorator';

describe('decorate', () => {
	const decorator1 = fake();
	const decorator2 = fake();
	const decorator3 = fake();
	const decorator4 = fake();
	const decorator5 = fake();
	const decorator6 = fake();
	const decorator7 = fake();
	const decorator8 = fake();

	class Foo {
		@decorate(decorator1)
		public static FOO;

		@decorate(decorator2)
		public bar(){}
	}

	@decorate(decorator7)
	@decorate(decorator8)
	class Bar {
		@decorate(decorator3)
		public static foo(){}

		@decorate(decorator4)
		public bar;

		@decorate(decorator5)
		@decorate(decorator6)
		public baz;
	}

	it('should work for instance methods', () => {
		expect(getDecoratorsForClass(Foo)?.instance?.method?.bar).to.deep.equal([decorator2]);
		assert.calledWithExactly(decorator2, Foo.prototype, 'bar', Object.getOwnPropertyDescriptor(Foo.prototype, 'bar'));
	});

	it('should work for instance properties', () => {
		expect(getDecoratorsForClass(Bar)?.instance?.property?.bar).to.deep.equal([decorator4]);
		assert.calledWith(decorator4, Bar.prototype, 'bar');
	});

	it('should work for static methods', () => {
		expect(getDecoratorsForClass(Bar)?.static?.method?.foo).to.deep.equal([decorator3]);
		assert.calledWithExactly(decorator3, Bar, 'foo', Object.getOwnPropertyDescriptor(Bar, 'foo'));
	});

	it('should work for static properties', () => {
		expect(getDecoratorsForClass(Foo)?.static?.property?.FOO).to.deep.equal([decorator1]);
		assert.calledWith(decorator1, Foo, 'FOO');
	});

	it('should work for multiple decorators on one field and retain application order', () => {
		expect(getDecoratorsForClass(Bar)?.instance?.property?.baz).to.deep.equal([decorator6, decorator5]);
		assert.calledWith(decorator6, Bar.prototype, 'baz', Object.getOwnPropertyDescriptor(Bar.prototype, 'baz'));
		assert.calledWith(decorator5, Bar.prototype, 'baz', Object.getOwnPropertyDescriptor(Bar.prototype, 'baz'));
		expect(decorator6.calledBefore(decorator5)).to.be.true;
	});

	it('should work for class decorators', () => {
		expect(getDecoratorsForClass(Bar)?.class).to.deep.equal([decorator8, decorator7]);
		assert.calledWithExactly(decorator8, Bar);
		assert.calledWithExactly(decorator7, Bar);
		expect(decorator8.calledBefore(decorator7)).to.be.true;
	});
});

describe('getAllDecoratorsForHierarchy', () => {
	const decorator1 = fake();
	const decorator2 = fake();
	const decorator3 = fake();
	const decorator4 = fake();
	const decorator5 = fake();
	const decorator6 = fake();
	const decorator7 = fake();
	const decorator8 = fake();

	class Foo { @decorate(decorator1) method1(){} }
	class Bar { @decorate(decorator2) method2(){} }
	class SubFoo extends Foo{ @decorate(decorator3) method3(){} }
	class SubBar extends Bar { @decorate(decorator4) method4(){} }
	class FooBar extends Mixin(Foo, Bar) { @decorate(decorator5) method5(){} }
	class SubFooSubBar extends Mixin(SubFoo, SubBar) { @decorate(decorator6) method6(){} }
	class FooBarSubFooSubBar extends Mixin(FooBar, SubFooSubBar) { @decorate(decorator7) method7(){} }
	class SubFooBarSubFooSubBar extends FooBarSubFooSubBar { @decorate(decorator8) method8(){} }

	it('should pick up first-level decorators', () => {
		expect(deepDecoratorSearch(Foo)?.instance?.method).to.deep.equal({
			method1: [decorator1],
		});

		expect(deepDecoratorSearch(Bar)?.instance?.method).to.deep.equal({
			method2: [decorator2],
		});
	});

	it('should pick up single-inherited decorators', () => {
		expect(deepDecoratorSearch(SubFoo)?.instance?.method).to.deep.equal({
			method1: [decorator1],
			method3: [decorator3],
		});

		expect(deepDecoratorSearch(SubBar)?.instance?.method).to.deep.equal({
			method2: [decorator2],
			method4: [decorator4],
		});
	});

	it('should pick up multi-inherited decorators', () => {
		expect(deepDecoratorSearch(FooBar)?.instance?.method).to.deep.equal({
			method1: [decorator1],
			method2: [decorator2],
			method5: [decorator5],
		});
	});

	it('should pick up a mix of inherited decorators', () => {
		expect(deepDecoratorSearch(SubFooSubBar)?.instance?.method).to.deep.equal({
			method1: [decorator1],
			method2: [decorator2],
			method3: [decorator3],
			method4: [decorator4],
			method6: [decorator6],
		});
	});

	it('should pick up a deep mix of inherited decorators', () => {
		expect(deepDecoratorSearch(FooBarSubFooSubBar)?.instance?.method).to.deep.equal({
			method1: [decorator1],
			method2: [decorator2],
			method3: [decorator3],
			method4: [decorator4],
			method5: [decorator5],
			method6: [decorator6],
			method7: [decorator7],
		});
	});

	it('should pick a really deep mix of inherited decorators', () => {
		expect(deepDecoratorSearch(SubFooBarSubFooSubBar)?.instance?.method).to.deep.equal({
			method1: [decorator1],
			method2: [decorator2],
			method3: [decorator3],
			method4: [decorator4],
			method5: [decorator5],
			method6: [decorator6],
			method7: [decorator7],
			method8: [decorator8],
		});
	});
});
