import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class Foo {
	public getFoo(){
		return 'foo'
	}
}

class Bar {
	public getBar(){
		return 'bar';
	}
}

class FooBar extends Mixin(Foo, Bar) {
	public getFoo() {
		return 'not foo'
	}

	public getBar() {
		return 'not bar';
	}
}

describe('Overriding use case', function(){
	let fb: FooBar;
	beforeEach(function(){
		fb = new FooBar();
	});

	it('should properly override base methods', function(){
		expect(fb.getFoo()).to.equal('not foo');
	});

	it('should properly override mixed in methods', function(){
		expect(fb.getBar()).to.equal('not bar');
	});
});
