import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin, settings } from '../../src';

describe('Using an init function', () => {
	forEachSettings(() => {
		it('should call init function with correct `this` and constructor arguments', () => {
			settings.initFunction = '__init__';

			let expectedInitCall: any = null;

			class Foo {
				public constructor(foo: string, bar: number) {}

				private __init__(foo: string, bar: number) {
					expectedInitCall = [this, foo, bar];
				}
			}

			class Bar {}

			const FooBar = Mixin(Foo, Bar);

			const fooBar = new FooBar('foo', 42);

			expect(expectedInitCall).to.deep.equal([fooBar, 'foo', 42]);
		});
	});
});
