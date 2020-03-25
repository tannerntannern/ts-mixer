import 'mocha';
import { expect } from 'chai';
import { fake, assert } from 'sinon';

import { decorate, decorators } from '../../src/decorator';

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
		expect(decorators.get(Foo).instance.method.bar).to.deep.equal([decorator2]);
		assert.calledWithExactly(decorator2, Foo.prototype, 'bar', Object.getOwnPropertyDescriptor(Foo.prototype, 'bar'));
	});

	it('should work for instance properties', () => {
		expect(decorators.get(Bar).instance.property.bar).to.deep.equal([decorator4]);
		assert.calledWith(decorator4, Bar.prototype, 'bar');
	});

	it('should work for static methods', () => {
		expect(decorators.get(Bar).static.method.foo).to.deep.equal([decorator3]);
		assert.calledWithExactly(decorator3, Bar, 'foo', Object.getOwnPropertyDescriptor(Bar, 'foo'));
	});

	it('should work for static properties', () => {
		expect(decorators.get(Foo).static.property.FOO).to.deep.equal([decorator1]);
		assert.calledWith(decorator1, Foo, 'FOO');
	});

	it('should work for multiple decorators on one field and retain application order', () => {
		expect(decorators.get(Bar).instance.property.baz).to.deep.equal([decorator6, decorator5]);
		assert.calledWith(decorator6, Bar.prototype, 'baz', Object.getOwnPropertyDescriptor(Bar.prototype, 'baz'));
		assert.calledWith(decorator5, Bar.prototype, 'baz', Object.getOwnPropertyDescriptor(Bar.prototype, 'baz'));
		expect(decorator6.calledBefore(decorator5)).to.be.true;
	});

	it('should work for class decorators', () => {
		expect(decorators.get(Bar).class).to.deep.equal([decorator8, decorator7]);
		assert.calledWithExactly(decorator8, Bar);
		assert.calledWithExactly(decorator7, Bar);
		expect(decorator8.calledBefore(decorator7)).to.be.true;
	});
});
