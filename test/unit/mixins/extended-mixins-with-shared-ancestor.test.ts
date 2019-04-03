import 'mocha';
import {expect} from 'chai';
import {Mixin} from '../../../src/mixins';

class Base {
	methodA() { return 'a' }
	methodB() { return 'b' }
	methodC() { return 'c' }
}

class Sub1 extends Base {
	methodA() { return 'A' }
}

class Sub2 extends Base {
	methodB() { return 'B' }
}

class Mixed extends Mixin(Sub1, Sub2) {}

describe('Using mixins that share a common ancestor', function(){
	let m;
	beforeEach(function(){
		m = new Mixed();
	});

	/**
	 * This is what we're trying to test:
	 *
	 * The Mixin function applies prototypes in the order that they are given, methods in Sub1 will be overridden by
	 * Sub2.  However, before each mixin prototype is applied, the Mixin function will apply the entire prototype chain
	 * of that Mixin.
	 *
	 * Since both Sub1 and Sub2 inherit from Base, the theoretical order of prototype application would be:
	 * Base, Sub1, Base, Sub2.
	 *
	 * This re-application of the shared ancestor (Base) may cause the methods that Sub1 overrides to be re-overridden
	 * with the Base methods, which is undesirable.  To fix this, the Mixin function keeps track of the mixin prototypes
	 * that it has already applied, and doesn't re-apply them.
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
