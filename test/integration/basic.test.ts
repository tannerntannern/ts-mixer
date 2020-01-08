import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Basic use case', () => {
	forEachSettings(() => {
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

		let fb: FooBar;
		beforeEach(() => {
			fb = new FooBar();
		});

		it('should inherit all instance properties', () => {
			expect(fb.hasBase).to.equal(true);
			expect(fb.foo).to.equal('foo');
			expect(fb.bar).to.equal('bar');
		});

		it('should inherit all methods', () => {
			expect(fb.makeFoo()).to.equal('foo');
			expect(fb.makeBar()).to.equal('bar');
			expect(fb.makeFooBar()).to.equal('foobar');
		});
	});
});
