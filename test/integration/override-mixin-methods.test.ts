import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Overriding use case', () => {
	forEachSettings(() => {
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

		let fb: FooBar;
		beforeEach(() => {
			fb = new FooBar();
		});

		it('should properly override base methods', () => {
			expect(fb.getFoo()).to.equal('not foo');
		});

		it('should properly override mixed in methods', () => {
			expect(fb.getBar()).to.equal('not bar');
		});
	});
});
