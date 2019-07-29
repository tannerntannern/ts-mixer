import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class ClassA {
	static staticFunction() {
		return 'A';
	}
}

class ClassB extends Mixin(ClassA) {}

describe('Static functions', () => {
	it('should inherit static functions properly', () => {
		expect(ClassB.staticFunction()).to.equal('A');
	});
});
