import 'mocha';
import { forEachSettings } from '../util';

import { Mixin } from '../../src';

describe('Abstract classes', () => {
	forEachSettings(() => {
		it('should inherit "abstractness" properly', () => {
			abstract class Foo {}
			abstract class Bar {}
			class Baz {}
			class Qux {}

			const FooBar = Mixin(Foo, Bar);
			const BarBaz = Mixin(Bar, Baz);
			const BazQux = Mixin(Baz, Qux);

			// @ts-expect-error: all constituent classes are abstract
			new FooBar();

			// @ts-expect-error: at least one of the constituent classes is abstract
			new BarBaz();

			// no error because all constituent classes are concrete
			new BazQux();
		});
	});
});
