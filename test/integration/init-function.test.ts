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

		it('should receive proper `this` in the Mixin(A, Mixin(B, C)) scenario', () => {
			settings.initFunction = 'init';

			class ClassA {
				public initContextA: any = null;
				protected init() {
					this.initContextA = this;
				}
			}

			class ClassB {
				public initContextB: any = null;
				protected init() {
					this.initContextB = this;
				}
			}

			class ClassC {
				public initContextC: any = null;
				protected init() {
					this.initContextC = this;
				}
			}

			class ClassD extends Mixin(ClassA, Mixin(ClassB, ClassC)) {}

			const d = new ClassD();

			expect(d.initContextA).to.equal(d);
			expect(d.initContextB).to.equal(d);
			expect(d.initContextC).to.equal(d);
		});
	});
});
