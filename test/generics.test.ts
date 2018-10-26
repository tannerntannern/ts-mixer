// ======= NOTE =======
// This file simply proves that the type checking on generic mixins works correctly.  No actual tests are run.

import Mixin from '../src/mixins';

class GenericClassA<T> {
	testA(input: T) {}
}

class GenericClassB<T> {
	testB(input: T) {}
}

function MyMixed<A, B>() {
	return class MyMixed extends Mixin<GenericClassA<A>, GenericClassB<B>>(GenericClassA, GenericClassB) {
		otherMethod(input1: A, input2: B) {}
	}
}

let mm = new (MyMixed<string, number>())();
mm.testA('test');		// works
// mm.testB('test');	// TS2345: Argument of type '"test"' is not assignable to parameter of type 'number'.