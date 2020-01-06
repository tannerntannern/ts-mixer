import { isClass } from 'is-class';
import { protoChain } from './proto';
import { Longest } from './tuple';  // TODO: need something more than just Longest: also forces all to be subset of longest

/**
 * Utility function that works like `Object.apply`, but copies properties with getters and setters properly as well.
 * Additionally gives the option to exclude properties by name.
 */
function copyProps(dest, src, exclude: string[] = []) {
	const props = Object.getOwnPropertyDescriptors(src);
	for (let prop of exclude) delete props[prop];
	Object.defineProperties(dest, props);
}

/**
 * Utility function for mixing a number of prototypes into a target object.  Utilizes getProtoChain() to intelligently
 * apply the mixing.
 */
function mixPrototypes(target, ingredients: any[], exclude: string[] = []) {
	let appliedPrototypes = [];
	for (let prototype of ingredients) {
		let protos = protoChain(prototype);

		// Apply the prototype chain in reverse order, so that old methods don't override newer ones; also make sure
		// that the same prototype is never applied more than once.
		for(let i = protos.length - 1; i >= 0; i --) {
			let newProto = protos[i];

			if (appliedPrototypes.indexOf(newProto) === -1) {
				copyProps(target, protos[i], exclude);
				appliedPrototypes.push(newProto);
			}
		}
	}
}

/**
 * A rigorous type alias for a class.
 */
type Class<CtorArgs extends any[] = any[], InstanceType = {}, StaticType = {}> =
	{new(...args: CtorArgs): InstanceType} & {[K in keyof StaticType]: StaticType[K]};

/**
 * Mixes a number of classes together.  Overloads are provided for up to 10 inputs, which should be more than plenty.
 */
function Mixin<
	A extends any[], I1, S1
>(
	c1: Class<A, I1, S1>,
): Class<
	A,
	I1,
	S1
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
): Class<
	Longest<A1, A2>,
	I1 & I2,
	S1 & S2
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
): Class<
	Longest<A1, A2, A3>,
	I1 & I2 & I3,
	S1 & S2 & S3
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
): Class<
	Longest<A1, A2, A3, A4>,
	I1 & I2 & I3 & I4,
	S1 & S2 & S3 & S4
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
): Class<
	Longest<A1, A2, A3, A4, A5>,
	I1 & I2 & I3 & I4 & I5,
	S1 & S2 & S3 & S4 & S5
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
	A6 extends any[], I6, S6,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
	c6: Class<A6, I6, S6>,
): Class<
	Longest<A1, A2, A3, A4, A5, A6>,
	I1 & I2 & I3 & I4 & I5 & I6,
	S1 & S2 & S3 & S4 & S5 & S6
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
	A6 extends any[], I6, S6,
	A7 extends any[], I7, S7,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
	c6: Class<A6, I6, S6>,
	c7: Class<A7, I7, S7>,
): Class<
	Longest<A1, A2, A3, A4, A5, A6, A7>,
	I1 & I2 & I3 & I4 & I5 & I6 & I7,
	S1 & S2 & S3 & S4 & S5 & S6 & S7
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
	A6 extends any[], I6, S6,
	A7 extends any[], I7, S7,
	A8 extends any[], I8, S8,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
	c6: Class<A6, I6, S6>,
	c7: Class<A7, I7, S7>,
	c8: Class<A8, I8, S8>,
): Class<
	Longest<A1, A2, A3, A4, A5, A6, A7, A8>,
	I1 & I2 & I3 & I4 & I5 & I6 & I7 & I8,
	S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
	A6 extends any[], I6, S6,
	A7 extends any[], I7, S7,
	A8 extends any[], I8, S8,
	A9 extends any[], I9, S9,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
	c6: Class<A6, I6, S6>,
	c7: Class<A7, I7, S7>,
	c8: Class<A8, I8, S8>,
	c9: Class<A9, I9, S9>,
): Class<
	Longest<A1, A2, A3, A4, A5, A6, A7, A8, A9>,
	I1 & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9,
	S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9
>;

function Mixin<
	A1 extends any[], I1, S1,
	A2 extends any[], I2, S2,
	A3 extends any[], I3, S3,
	A4 extends any[], I4, S4,
	A5 extends any[], I5, S5,
	A6 extends any[], I6, S6,
	A7 extends any[], I7, S7,
	A8 extends any[], I8, S8,
	A9 extends any[], I9, S9,
	A10 extends any[], I10, S10,
>(
	c1: Class<A1, I1, S1>,
	c2: Class<A2, I2, S2>,
	c3: Class<A3, I3, S3>,
	c4: Class<A4, I4, S4>,
	c5: Class<A5, I5, S5>,
	c6: Class<A6, I6, S6>,
	c7: Class<A7, I7, S7>,
	c8: Class<A8, I8, S8>,
	c9: Class<A9, I9, S9>,
	c10: Class<A10, I10, S10>,
): Class<
	Longest<A1, A2, A3, A4, A5, A6, A7, A8, A9, A10>,
	I1 & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9 & I10,
	S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10
>;

function Mixin(...ingredients: Class[]) {
	// Start building a class that represents the mixture of the given Base and Class
	class Mixed {
		constructor(...args) {
			for (const constructor of ingredients) {
				// If the constructor is a callable JS function, we would prefer to apply it directly to `this`,
				if (!isClass(constructor))
					// @ts-ignore
					constructor.apply(this, args);

				// but if it's an ES6 class, we can't call it directly so we have to instantiate it and copy props
				else copyProps(this, new constructor(...args));
			}
		}
	}

	// Apply prototypes, including those up the chain
	mixPrototypes(Mixed.prototype, ingredients.map(ctor => ctor.prototype), ['constructor']);

	// Mix static properties
	mixPrototypes(Mixed, ingredients, ['prototype', 'length', 'name']);

	return Mixed as any;
}

/**
 * A decorator version of the `Mixin` function.  You'll want to use this instead of `Mixin` for mixing generic classes.
 */
const mix = (...ingredients: Class[]) =>
	// @ts-ignore
	decoratedClass => Mixin(...(ingredients.concat([decoratedClass])));

export {Mixin, mix};
