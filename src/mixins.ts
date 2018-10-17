// Based on https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-429426722
export type Class<T> = new(...args: any[]) => T;
export function Mixin<C1>(ctor1: Class<C1>): Class<C1>;
export function Mixin<C1, C2>(ctor1: Class<C1>, ctor2: Class<C2>): Class<C1 & C2>;
export function Mixin<C1, C2, C3>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>): Class<C1 & C2 & C3>;
export function Mixin<C1, C2, C3, C4>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>, ctor4: Class<C4>): Class<C1 & C2 & C3 & C4>;
export function Mixin<C1, C2, C3, C4, C5>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>, ctor4: Class<C4>, ctor5: Class<C5>): Class<C1 & C2 & C3 & C4 & C5>;
export function Mixin<C1, C2, C3, C4, C5, C6>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>, ctor4: Class<C4>, ctor5: Class<C5>, ctor6: Class<C6>): Class<C1 & C2 & C3 & C4 & C5 & C6>;
export function Mixin<C1, C2, C3, C4, C5, C6, C7>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>, ctor4: Class<C4>, ctor5: Class<C5>, ctor6: Class<C6>, ctor7: Class<C7>): Class<C1 & C2 & C3 & C4 & C5 & C6 & C7>;
export function Mixin<C1, C2, C3, C4, C5, C6, C7, C8>(ctor1: Class<C1>, ctor2: Class<C2>, ctor3: Class<C3>, ctor4: Class<C4>, ctor5: Class<C5>, ctor6: Class<C6>, ctor7: Class<C7>, ctor8: Class<C8>): Class<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8>;
export function Mixin(...constructors: Class<any>[]) {
	return constructors.reduce((clazz, mixin, index) => {
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
}
