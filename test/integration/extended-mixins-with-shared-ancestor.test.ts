import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class Base {
	methodA() { return 'a' }
	methodB() { return 'b' }
	methodC() { return 'c' }
}

class Foo extends Base {
	methodA() { return 'A' }
}

class Bar extends Base {
	methodB() { return 'B' }
}

class Mixed extends Mixin(Foo, Bar) {}

describe('Using mixins that share a common ancestor', function(){
	let m: Mixed;
	beforeEach(function(){
		m = new Mixed();
	});

	/**
	 * This is what we're trying to test:
	 *
	 * The Mixin function applies prototypes in the order that they are given, so methods in Foo will be overridden by
	 * Bar.  Since both Foo and Bar inherit from Base, the theoretical order of prototype application would be:
	 * Base, Foo, Base, Bar.
	 *
	 * This order would cause issues: because Base is re-applied AFTER Foo, Base's methods would take priority over
	 * those of Foo, even though Foo extends Base and overrides some of its methods.  This is clearly undesirable.  To
	 * prevent this from happening, hardMixProtos(...) keeps track of which prototypes have already been applied and
	 * doesn't re-apply them if it encounters them again.
	 *
	 * If this check wasn't in place, we would expect the following:
	 * 		Mixed#methodA() -> 'a'	// re-overridden by Base
	 * 		Mixed#methodB() -> 'B'
	 * 		Mixed#methodC() -> 'c'
	 *
	 * If the check works as it should, we expect the following instead:
	 * 		Mixed#methodA() -> 'A'
	 * 		Mixed#methodB() -> 'B'
	 * 		Mixed#methodC() -> 'c'
	 */
	it('should not apply the shared ancestor more than once', function(){
		expect(m.methodA()).to.not.equal('a');	// re-override test
		expect(m.methodA()).to.equal('A');		// what it should be

		expect(m.methodB()).to.equal('B');
		expect(m.methodC()).to.equal('c');
	});
});
