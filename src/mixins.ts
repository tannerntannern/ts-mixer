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
function Mixin(...constructors: Constructor<any>[]) {
	// Mix constructors and prototypes
	let Mixed = constructors.reduce((clazz, mixin, index) => {
		if (index === 0) return mixin;

		class MixedClass extends mixin {
			constructor(...args: any[]) {
				super(...args);
				clazz.apply(this, args);
			}
		}

		Object.assign(MixedClass.prototype, clazz.prototype, mixin.prototype);

		return MixedClass;
	});

	// Mix static properties
	for(let constructor of constructors)
		for(let prop in constructor)
			if (constructor.hasOwnProperty(prop)) Mixed[prop] = constructor[prop];

	return Mixed;
}

export default Mixin;