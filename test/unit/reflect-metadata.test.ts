import 'mocha';
import {expect} from 'chai';
import {Mixin, Augment} from '../../src/mixins';

import { addFooMetadata, getFooMetadata } from '../reflect-metadata.helper';

@addFooMetadata('wibble')
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

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		return `They are jumping ${this.jumpHeight} ft in the air`;
	}
}

class Extras extends Mixin(RunnerWithCoolShoesMixin, JumperMixin) {}
class LongJumper extends Augment(Person, Extras) {}

describe('Using a mixin that extends another class', function(){
	let lj;
	beforeEach(function(){
		lj = new LongJumper('Bob');
	});

  it('should have the reflect metadata of the base class available', function(){
    expect(getFooMetadata(LongJumper)).to.equal("wibble");
    expect(getFooMetadata(lj.constructor)).to.equal("wibble");
  });

	it('should be able to access properties from the class that the Mixin extends', function(){
		expect(lj.runSpeed).to.equal(10);
	});

	it('should be able to use methods available on the class that the Mixin extends', function(){
		expect(lj.run()).to.equal('They are running at 10 ft/sec');
	});
});
