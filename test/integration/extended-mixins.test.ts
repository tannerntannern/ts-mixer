import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class Foo {
	public readonly foo: string = 'foo';

	public getFoo() {
		return this.foo;
	}
}

class Bar extends Foo {}

class Baz {}

class BarBaz extends Mixin(Bar, Baz) {}

describe('Using a mixin that extends another class', function(){
	let bb: BarBaz;
	beforeEach(function(){
		bb = new BarBaz();
	});

	it('should be able to access properties from the class that the Mixin extends', function(){
		expect(bb.foo).to.equal('foo');
	});

	it('should be able to use methods available on the class that the Mixin extends', function(){
		expect(bb.getFoo()).to.equal('foo');
	});
});
