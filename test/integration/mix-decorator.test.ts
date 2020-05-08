import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { mix } from '../../src';

describe('mix(...) decorator', () => {
	forEachSettings(() => {
		it('should preserve the decorated class\'s constructor name', () => {
			class Foo {}
			class Bar {}

			interface FooBar extends Foo, Bar {}
			@mix(Foo, Bar)
			class FooBar {}

			const fooBar = new FooBar();

			expect(FooBar.name).to.equal('FooBar');
			expect(fooBar.constructor.name).to.equal('FooBar');
		});
	});
});
