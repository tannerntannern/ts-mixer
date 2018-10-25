import 'mocha';
import Mixin from '../src/mixins';
import {expect} from 'chai';

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

class RunnerWithCoolShoesMixin extends RunnerMixin {
	protected shoeColor: string = 'red';

	public brag() {
		return `Look at my awesome ${this.shoeColor} shoes!`;
	}
}

class RunnerWithCoolSocksMixin extends RunnerMixin {
	protected sockColor: string = 'blue';

	public putOnSocks() {
		return `Observe as I put on my ${this.sockColor} socks`
	}
}

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		return `They are jumping ${this.jumpHeight} ft in the air`;
	}
}

class LongJumper extends Mixin(Person, RunnerWithCoolShoesMixin, JumperMixin) {}

describe('Using a mixin that extends another class', function(){
	let lj;
	beforeEach(function(){
		lj = new LongJumper('Bob');
	});

	it('should be able to access properties from the class that the Mixin extends', function(){
		expect(lj.runSpeed).to.equal(10);
	});

	it('should be able to use methods available on the class that the Mixin extends', function(){
		expect(lj.run()).to.equal('They are running at 10 ft/sec');
	});
});

describe('Using mixins that share a common ancestor', function(){
	// TODO ...
});