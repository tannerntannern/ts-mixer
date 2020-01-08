import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Using a mixin that extends another class', () => {
	forEachSettings(() => {
		class Foo {
			public readonly foo: string = 'foo';

			public getFoo() {
				return this.foo;
			}
		}

		class Bar extends Foo {}

		class Baz {}

		class BarBaz extends Mixin(Bar, Baz) {}

		let bb: BarBaz;
		beforeEach(() => {
			bb = new BarBaz();
		});

		it('should be able to access properties from the class that the Mixin extends', () => {
			expect(bb.foo).to.equal('foo');
		});

		it('should be able to use methods available on the class that the Mixin extends', () => {
			expect(bb.getFoo()).to.equal('foo');
		});
	});
});
