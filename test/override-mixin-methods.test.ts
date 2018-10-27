import 'mocha';
import {expect} from 'chai';
import {Mixin} from '../src/mixins';

class Person {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}

	public introduce(){
		return `This is ${this.name}`;
	}
}

class RunnerMixin {
	protected runSpeed: number = 10;

	public run(){
		return `They are running at ${this.runSpeed} ft/sec`;
	}
}

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		return `They are jumping ${this.jumpHeight} ft in the air`;
	}
}

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin) {
	public introduce() {
		return "This is " + this.name;
	}

	public jump() {
		return this.name + ' has jumped ' + this.jumpHeight + ' ft high!';
	}
}

describe('Overriding use case', function(){
	let lj;
	beforeEach(function(){
		lj = new LongJumper('Bob');
	});

	it('should properly override base methods', function(){
		expect(lj.introduce()).to.equal('This is Bob');
	});

	it('should properly override mixed in methods', function(){
		expect(lj.jump()).to.equal('Bob has jumped 3 ft high!');
	});
});