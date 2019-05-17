import 'mocha';
import {Mixin} from '../../src/mixins';
import {expect} from 'chai';

class Person {
	static TOTAL: number = 0;

	protected name: string;

	constructor(name: string) {
		this.name = name;
		(this.constructor as typeof Person).TOTAL ++;
	}
}

class RunnerMixin {}

class JumperMixin {}

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin) {}

describe('Static properties', function(){
	beforeEach(() => {
		Person.TOTAL = 0;
	});

	it('should update base class static prop when the mixed class changes it', function(){
		// Invoke the TOTAL incrementer from two different constructors
		new Person('Bob');
		new LongJumper('Joe');

		expect(Person.TOTAL).to.equal(2);
		expect(LongJumper.TOTAL).to.equal(2);
	});
	
	it('setting the static prop on the mixed class should change the base class prop as well', () => {
		LongJumper.TOTAL = 20;

		expect(Person.TOTAL).to.equal(20);
		expect(LongJumper.TOTAL).to.equal(20);
	});

	it('setting the static prop on the base class should change the mixed class prop as well', () => {
		Person.TOTAL = 45;

		expect(Person.TOTAL).to.equal(45);
		expect(LongJumper.TOTAL).to.equal(45);
	});
});
