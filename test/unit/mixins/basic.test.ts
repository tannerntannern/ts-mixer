import 'mocha';
import {expect} from 'chai';
import {Mixin} from '../../../src/mixins';

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
	protected stateDistance() {
		return 'They landed ' + this.runSpeed * this.jumpHeight + ' ft from the start!';
	}

	public longJump() {
		let msg = "";
		msg += this.introduce() + '\n';
		msg += this.run() + '\n';
		msg += this.jump() + '\n';
		msg += this.stateDistance() + '\n';

		return msg;
	}
}

describe('Basic use case', function(){
	let lj;
	beforeEach(function(){
		lj = new LongJumper('Bob');
	});

	it('should inherit all instance properties', function(){
		expect(lj.name).to.equal('Bob');
		expect(lj.runSpeed).to.equal(10);
		expect(lj.jumpHeight).to.equal(3);
	});

	it('should inherit all methods', function(){
		expect(lj.introduce()).to.equal('This is Bob');
		expect(lj.run()).to.equal('They are running at 10 ft/sec');
		expect(lj.jump()).to.equal('They are jumping 3 ft in the air');
		expect(lj.longJump()).to.equal(
			'This is Bob\n' +
			'They are running at 10 ft/sec\n' +
			'They are jumping 3 ft in the air\n' +
			'They landed 30 ft from the start!\n'
		);
	});
});
