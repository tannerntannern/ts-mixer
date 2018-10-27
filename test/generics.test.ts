// ======= NOTE =======
// This file simply proves that the type checking on generic mixins works correctly.  No actual tests are run.

import {MixinDecorator} from '../src/mixins';

class GenericClassA<T> {
	testA(input: T) {}
}

class GenericClassB<T> {
	testB(input: T) {}
}

@MixinDecorator(GenericClassA, GenericClassB)
class Mixed<A, B> {
	newMethod(a: A, b: B) {}
}
interface Mixed<A, B> extends GenericClassA<A>, GenericClassB<B> {}

let mm = new Mixed<string, number>();

mm.testA('test');		// ok
// mm.testA(2);				// will cause error

mm.testB(2);			// ok
// mm.testB('test');		// will cause error