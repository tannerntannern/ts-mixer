import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class BaseClass {
	public readonly hasBase: boolean = true;
}

class FooMixin {
	public readonly foo: string = 'foo';

	public makeFoo(): string {
		return this.foo;
	}
}

class BarMixin {
	public readonly bar: string = 'bar';

	public makeBar(): string {
		return this.bar;
	}
}

class FooBar extends Mixin(BaseClass, FooMixin, BarMixin) {
	public makeFooBar() {
		return this.makeFoo() + this.makeBar();
	}
}

describe('Basic use case', function(){
	let fb: FooBar;
	beforeEach(function(){
		fb = new FooBar();
	});

	it('should inherit all instance properties', function(){
		expect(fb.hasBase).to.equal(true);
		expect(fb.foo).to.equal('foo');
		expect(fb.bar).to.equal('bar');
	});

	it('should inherit all methods', function(){
		expect(fb.makeFoo()).to.equal('foo');
		expect(fb.makeBar()).to.equal('bar');
		expect(fb.makeFooBar()).to.equal('foobar');
	});
});
