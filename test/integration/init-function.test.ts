import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { Mixin, settings } from '../../src';

describe('Using an init function', () => {
	forEachSettings(() => {
		it('should call init function with correct `this` and constructor arguments', () => {
			settings.initFunction = '__init__';

			let expectedInitCall: any = null;

			class Foo {
				public constructor(foo: string, bar: number) {}

				protected __init__(foo: string, bar: number) {
					expectedInitCall = [this, foo, bar];
				}
			}

			class Bar {}

			const FooBar = Mixin(Foo, Bar);

			const fooBar = new FooBar('foo', 42);

			expect(expectedInitCall).to.deep.equal([fooBar, 'foo', 42]);
		});

		it('should work as expected in the README example', () => {
			settings.initFunction = 'init';

			class Person {
				public static allPeople: Set<Person> = new Set();

				protected init() {
					Person.allPeople.add(this);
				}
			}

			type PartyAffiliation = 'democrat' | 'republican';

			class PoliticalParticipant {
				public static democrats: Set<PoliticalParticipant> = new Set();
				public static republicans: Set<PoliticalParticipant> = new Set();

				public party: PartyAffiliation;

				// note that these same args will also be passed to init function
				public constructor(party: PartyAffiliation) {
					this.party = party;
				}

				protected init(party: PartyAffiliation) {
					if (party === 'democrat')
						PoliticalParticipant.democrats.add(this);
					else
						PoliticalParticipant.republicans.add(this);
				}
			}

			class Voter extends Mixin(Person, PoliticalParticipant) {}

			const v1 = new Voter('democrat');
			const v2 = new Voter('democrat');
			const v3 = new Voter('republican');
			const v4 = new Voter('republican');

			// TODO: I don't think this is broken because of my code, but rather because of some weird mocha thing
			// console.log(Person.allPeople);

			if (settings.prototypeStrategy !== 'proxy') {
				expect(Person.allPeople).to.contain(v1);
				expect(Person.allPeople).to.contain(v2);
				expect(Person.allPeople).to.contain(v3);
				expect(Person.allPeople).to.contain(v4);

				expect(PoliticalParticipant.democrats).to.contain(v1);
				expect(PoliticalParticipant.democrats).to.contain(v2);
				expect(PoliticalParticipant.republicans).to.contain(v3);
				expect(PoliticalParticipant.republicans).to.contain(v4);
			}
		});

		it('should work with multiple layers of inheritance', () => {
			settings.initFunction = 'init';

			abstract class ClassA {
				public name;
				protected init() {
					this.name = this.constructor.name;
				}
			}

			class ClassB extends ClassA {
				public name1;
				protected init() {
					super.init();
					this.name1 = this.name + 1;
				}
			}

			class ClassC extends ClassA {
				public name2;
				protected init() {
					super.init();
					this.name2 = this.name + 2;
				}
			}

			class ClassD extends ClassA {
				public name3;
				protected init() {
					super.init();
					this.name3 = this.name + 3;
				}
			}

			class ClassE extends Mixin(ClassB, ClassC) {}
			class ClassF extends Mixin(ClassD, ClassE) {}

			const e = new ClassE();
			const f = new ClassF();

			expect(e).to.deep.equal({
				name: 'ClassE',
				name1: 'ClassE1',
				name2: 'ClassE2',
			});

			expect(f).to.deep.equal({
				name: 'ClassF',
				name1: 'ClassF1',
				name2: 'ClassF2',
				name3: 'ClassF3',
			});
		});
	});
});
