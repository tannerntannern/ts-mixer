// ======= NOTE =======
// This file simply proves that the type checking on generic mixins works correctly.  No actual tests are run.

import 'mocha';
import {expect} from 'chai';
import {base} from '../src/mixins';
import { addFooMetadata, getFooMetadata } from './reflect-metadata.helper';

class GenericClassA<T> {
	testA(input: T) {}
}

class GenericClassB<T> {
	testB(input: T) {}
}

@addFooMetadata('wibble')
class Thingy<T> {
	protected val: T;

	public setThingy(val: T) {
		this.val = val;
	}

	public getThingy(){
		return this.val;
	}
}

// @mix(GenericClassA, GenericClassB)
@base(Thingy, GenericClassA, GenericClassB)
class Mixed<T, A, B> {
	newMethod(a: A, b: B) {}
}
interface Mixed<T, A, B> extends Thingy<T>, GenericClassA<A>, GenericClassB<B> {}

describe('Generics reflect-metadata and instanceof should work with @base', function(){
	let mm : Mixed<boolean, string, number>;
	beforeEach(function(){
		mm = new Mixed<boolean, string, number>();
	});

	it('should extend base class', function(){
    expect(mm instanceof Thingy).equals(true)
	});

	it('should be able to access metadata on the base class', function(){
    expect(getFooMetadata(Mixed)).to.equal("wibble");
    expect(getFooMetadata(mm.constructor)).to.equal("wibble");
	});

  it('should be able to use generic class A', function(){
    mm.testA('test');
	});

	it('should be able to use generic class B', function(){
    mm.testB(2);
	});

	it('should be able to use new method', function(){
    mm.newMethod('test', 2);
	});

	it('should be able to use base class methods', function(){
    expect(mm.getThingy()).to.equal(undefined);
    mm.setThingy(true)
    expect(mm.getThingy()).to.equal(true);
	});

});
