import 'mocha';
import {Mixin} from '../../../src/mixins';
import {expect} from 'chai';

class Person {
	static TOTAL: number = 0;

	protected name: string;

	constructor(name: string) {
		this.name = name;
		(<typeof Person> this.constructor).TOTAL ++;
	}
}

class RunnerMixin {}

class JumperMixin {}

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin) {}

describe('Static properties', function(){
	it('should update base class static prop when the mixed class changes it', function(){
		// Invoke the TOTAL incrementer from two different constructors
		new Person('Bob');
		new LongJumper('Joe');

		expect(Person.TOTAL).to.equal(2);
		expect((<typeof Person><unknown>LongJumper).TOTAL).to.equal(2);
	});
});
