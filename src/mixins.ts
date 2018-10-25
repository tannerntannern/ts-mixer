// Based on https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-429426722

/**
 * Utility function that returns the full chain of prototypes (excluding Object.prototype) from the given prototype.
 * The order will be [proto, protoParent, protoGrandparent, ...]
 */
function getProtoChain(proto: object): object[] {
	let protoChain = [];

	while(proto !== Object.prototype) {
		protoChain.push(proto);
		proto = Object.getPrototypeOf(proto);
	}

	return protoChain;
}

// Constructor type
type Ctor<T> = new(...args: any[]) => T;

// Overloads for up to 10 classes; it is exceedingly unlikely that you'll ever need to mix more than 10 classes at once
function Mixin<A>(a: Ctor<A>): (b) => Ctor<A>;
function Mixin<A, B>(a: Ctor<A>, b: Ctor<B>): (b) => Ctor<A & B>;
function Mixin<A, B, C>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>): (b) => Ctor<A & B & C>;
function Mixin<A, B, C, D>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>): (b) => Ctor<A & B & C & D>;
function Mixin<A, B, C, D, E>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>): (b) => Ctor<A & B & C & D & E>;
function Mixin<A, B, C, D, E, F>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>, f: Ctor<F>): (b) => Ctor<A & B & C & D & E & F>;
function Mixin<A, B, C, D, E, F, G>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>, f: Ctor<F>, g: Ctor<G>): (b) => Ctor<A & B & C & D & E & F & G>;
function Mixin<A, B, C, D, E, F, G, H>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>, f: Ctor<F>, g: Ctor<G>, h: Ctor<H>): (b) => Ctor<A & B & C & D & E & F & G & H>;
function Mixin<A, B, C, D, E, F, G, H, I>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>, f: Ctor<F>, g: Ctor<G>, h: Ctor<H>, i: Ctor<I>): (b) => Ctor<A & B & C & D & E & F & G & H & I>;
function Mixin<A, B, C, D, E, F, G, H, I, J>(a: Ctor<A>, b: Ctor<B>, c: Ctor<C>, d: Ctor<D>, e: Ctor<E>, f: Ctor<F>, g: Ctor<G>, h: Ctor<H>, i: Ctor<I>, j: Ctor<J>): (b) => Ctor<A & B & C & D & E & F & G & H & I & J>;

// Actual mixin implementation
function Mixin(...constructors: Ctor<any>[]) {
	return function(baseClass) {
		class MixedClass extends baseClass {
			// Apply each of the mixing class constructors
			constructor(...args: ConstructorParameters<typeof constructors[0]>) {
				super(...args);
				for(let constructor of constructors) constructor.apply(this, args);
			}
		}

		// Apply prototypes, including those up the chain
		let mixedClassProto = MixedClass.prototype,
			appliedPrototypes = [];
		for(let constructor of constructors) {
			let protoChain = getProtoChain(constructor.prototype);

			// Apply the prototype chain in reverse order, so that old methods don't override newer ones; also make sure
			// that the same prototype is never applied more than once.
			for(let i = protoChain.length - 1; i >= 0; i --) {
				let newProto = protoChain[i];

				if (appliedPrototypes.indexOf(newProto) === -1) {
					Object.assign(mixedClassProto, protoChain[i]);
					appliedPrototypes.push(newProto);
				}
			}
		}

		// Mix static properties by linking to the original static props with getters/setters
		for(let constructor of constructors) {
			for(let prop in constructor) {
				if (!MixedClass.hasOwnProperty(prop)) {
					Object.defineProperty(MixedClass, prop, {
						get() { return constructor[prop]; },
						set(val) { constructor[prop] = val; },
						enumerable: true,
						configurable: false
					});
				}
			}
		}

		return MixedClass;
	}
}

export default Mixin;

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

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin)(class {}) implements Person, RunnerMixin, JumperMixin {
	public introduce() {
		return "This is " + this.name;
	}

	public jump() {
		return this.name + ' has jumped ' + this.jumpHeight + ' ft high!';
	}
}