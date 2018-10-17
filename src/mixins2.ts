// export type Constructor<T = {}> = new (...args: any[]) => T;
//
// /* turns A | B | C into A & B & C */
// type UnionToIntersection<U> =
// 	(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
//
// /* merges constructor types - self explanitory */
// type MergeConstructorTypes<T extends Array<Constructor<any>>> =
// 	UnionToIntersection<InstanceType<T[number]>>;
//
// export function Mixin<T extends Array<Constructor<any>>>(constructors: T): Constructor<MergeConstructorTypes<T>> {
// 	const cls = class {
// 		state = {
// 		}
// 		constructor() {
// 			constructors.forEach((c: any) => {
// 				const oldState = this.state;
// 				c.apply(this);
// 				this.state = Object.assign({}, this.state, oldState);
// 			});
// 		}
// 	} as any;
// 	constructors.forEach((c: any) => {
// 		Object.assign(cls.prototype, c.prototype);
// 	});
// 	return cls as any;
// }
//
// class Person {
// 	static TEST = 'test';
// 	a: string;
// }
//
// class Runnable {
// 	run() { console.log('Running...') }
// 	b: string;
// }
//
// class Runner extends Mixin([Person, Runnable]) {
//
// }

type ClassType<Constructor extends new(...args: any[]) => any, Type> = Constructor & (new(...args: ConstructorParameters<Constructor>) => InstanceType<Constructor>);

