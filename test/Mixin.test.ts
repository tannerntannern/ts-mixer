import 'mocha';
import {expect} from 'chai';
import Mixin from '../src/mixins';

class Person {
	static TOTAL: number = 0;

	protected name: string;

	constructor(name: string) {
		this.name = name;
		(<typeof Person> this.constructor).TOTAL ++;
	}
}

class TrackPerson extends Person {
	public introduce(){
		return this.name + ' is stepping up to the event';
	}
}

class RunnerMixin {
	protected runSpeed: number = 10;

	public run(){
		return 'They are running at ' + this.runSpeed + ' ft/sec';
	}
}

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		return 'They are jumping ' + this.jumpHeight + ' ft in the air';
	}
}

describe('Mixin', function(){
	describe('Simple use case', function(){
		class LongJumper extends Mixin(TrackPerson, RunnerMixin, JumperMixin) {
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
			expect(lj.introduce()).to.equal('Bob is stepping up to the event');
			expect(lj.run()).to.equal('They are running at 10 ft/sec');
			expect(lj.jump()).to.equal('They are jumping 3 ft in the air');
			expect(lj.longJump()).to.equal(
				'Bob is stepping up to the event\n' +
				'They are running at 10 ft/sec\n' +
				'They are jumping 3 ft in the air\n' +
				'They landed 30 ft from the start!\n'
			);
		});
	});

	describe('Overriding use case', function(){
		class LongJumper extends Mixin(TrackPerson, RunnerMixin, JumperMixin) {
			public introduce() {
				return "This is " + this.name;
			}

			public jump() {
				return this.name + ' has jumped ' + this.jumpHeight + ' ft high!';
			}
		}

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

	describe('Accessing and changing static properties', function(){
		class LongJumper extends Mixin(TrackPerson, RunnerMixin, JumperMixin) {}

		it('should update base class static prop when the mixed class changes it', function(){
			// Manually reset TOTAL from previous tests.  Lazy, but not worth the time to restructure
			(<any>Person).TOTAL = 0;
			(<any>TrackPerson).TOTAL = 0;
			(<any>LongJumper).TOTAL = 0;

			// Invoke the TOTAL incrementer from two different constructors
			new TrackPerson('Bob');
			new LongJumper('Joe');

			expect(TrackPerson.TOTAL).to.equal(2);
			expect((<typeof TrackPerson><unknown>LongJumper).TOTAL).to.equal(2);
		});
	});

	describe('Using a mixin that extends another class', function(){
		class RunnerWithCoolShoesMixin extends RunnerMixin {
			protected shoeColor: string = 'red';

			public brag() {
				return 'Look at my awesome ' + this.shoeColor + ' shoes!';
			}
		}

		class LongJumper extends Mixin(TrackPerson, RunnerWithCoolShoesMixin, JumperMixin) {}

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
});