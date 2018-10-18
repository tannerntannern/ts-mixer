// Based on https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-429426722
type Constructor<T> = new(...args: any[]) => T;

function Mixin<C1>(ctor1: Constructor<C1>): Constructor<C1>;
function Mixin<C1, C2>(ctor1: Constructor<C1>, ctor2: Constructor<C2>): Constructor<C1 & C2>;
function Mixin<C1, C2, C3>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>): Constructor<C1 & C2 & C3>;
function Mixin<C1, C2, C3, C4>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>): Constructor<C1 & C2 & C3 & C4>;
function Mixin<C1, C2, C3, C4, C5>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>): Constructor<C1 & C2 & C3 & C4 & C5>;
function Mixin<C1, C2, C3, C4, C5, C6>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>): Constructor<C1 & C2 & C3 & C4 & C5 & C6>;
function Mixin<C1, C2, C3, C4, C5, C6, C7>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7>;
function Mixin<C1, C2, C3, C4, C5, C6, C7, C8>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>, ctor8: Constructor<C8>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8>;
function Mixin<C1, C2, C3, C4, C5, C6, C7, C8, C9>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>, ctor8: Constructor<C8>, ctor9: Constructor<C9>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9>;
function Mixin(...constructors: Constructor<any>[]) {
	// The first constructor is assumed to be the base class
	let Base = constructors[0];

	class MixedClass extends Base {
		constructor(...args: ConstructorParameters<typeof Base>) {
			super(...args);

			// Apply each of the constructors, except Base, which is called by `super(...args)`
			for(let constructor of constructors.slice(1))
				constructor.apply(this, ...args);
		}
	}

	// Apply prototypes, including those up the chain
	// TODO: decide whether to build a prototype chain, or copy properties into a single prototype

	// Mix static properties, but in the traditional sense where no static properties can be overridden
	for(let constructor of constructors)
		for(let prop in constructor)
			if (constructor.hasOwnProperty(prop) && !MixedClass.hasOwnProperty(prop))
				Object.defineProperty(MixedClass, prop, {
					get(){ return constructor[prop]; },
					set(val){ constructor[prop] = val; },
					enumerable: true,
					configurable: false,
					writable: true,
					value: constructor[prop]
				});

	return MixedClass;
}

export default Mixin;
