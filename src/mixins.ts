import { proxyMix, softMixProtos } from './proxy';
import { Class, Longest } from './types'; // TODO: need something more than just Longest: also forces all to be subset of longest
import { settings } from './settings';
import { copyProps, hardMixProtos } from './util';
import { directDecoratorSearch, deepDecoratorSearch, PropertyAndMethodDecorators } from './decorator';
import { registerMixins } from './mixin-tracking';

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

function Mixin(...constructors: Class[]) {
	const prototypes = constructors.map(constructor => constructor.prototype);

	// Here we gather up the init functions of the ingredient prototypes, combine them into one init function, and
	// attach it to the mixed class prototype.  The reason we do this is because we want the init functions to mix
	// similarly to constructors -- not methods, which simply override each other.
	const initFunctionName = settings.initFunction;
	if (initFunctionName !== null) {
		const initFunctions: Function[] = prototypes
			.map(proto => proto[initFunctionName])
			.filter(func => typeof func === 'function');

		const combinedInitFunction = function(...args) {
			for (let initFunction of initFunctions)
				initFunction.apply(this, args);
		};

		const extraProto = { [initFunctionName]: combinedInitFunction };

		prototypes.push(extraProto);
	}

	function MixedClass(...args) {
		for (const constructor of constructors)
			// @ts-ignore: potentially abstract class
			copyProps(this, new constructor(...args));

		if (initFunctionName !== null && typeof this[initFunctionName] === 'function')
			this[initFunctionName].apply(this, args);
	}

	MixedClass.prototype = settings.prototypeStrategy === 'copy'
		? hardMixProtos(prototypes, MixedClass)
		: softMixProtos(prototypes, MixedClass);

	Object.setPrototypeOf(
		MixedClass,
		settings.staticsStrategy === 'copy'
			? hardMixProtos(constructors, null, ['prototype'])
			: proxyMix(constructors, Function.prototype)
	);

	let DecoratedMixedClass: any = MixedClass;

	if (settings.decoratorInheritance !== 'none') {
		const classDecorators = settings.decoratorInheritance === 'deep'
			? deepDecoratorSearch(...constructors)
			: directDecoratorSearch(...constructors);

		for (let decorator of classDecorators?.class ?? []) {
			const result = decorator(DecoratedMixedClass);

			if (result) {
			  DecoratedMixedClass = result;
			}
		}

		applyPropAndMethodDecorators(classDecorators?.static ?? {}, DecoratedMixedClass);
		applyPropAndMethodDecorators(classDecorators?.instance ?? {}, DecoratedMixedClass.prototype);
	}

	registerMixins(DecoratedMixedClass, constructors);

	return DecoratedMixedClass;
}

const applyPropAndMethodDecorators = (propAndMethodDecorators: PropertyAndMethodDecorators, target: Object) => {
	const propDecorators = propAndMethodDecorators.property;
	const methodDecorators = propAndMethodDecorators.method;

	if (propDecorators)
		for (let key in propDecorators)
			for (let decorator of propDecorators[key])
				decorator(target, key);

	if (methodDecorators)
		for (let key in methodDecorators)
			for (let decorator of methodDecorators[key])
				decorator(target, key, Object.getOwnPropertyDescriptor(target, key)!);
};

/**
 * A decorator version of the `Mixin` function.  You'll want to use this instead of `Mixin` for mixing generic classes.
 */
const mix = (...ingredients: Class[]) =>
	decoratedClass => {
		// @ts-ignore
		const mixedClass = Mixin(...ingredients.concat([decoratedClass]));

		Object.defineProperty(mixedClass, 'name', {
			value: decoratedClass.name,
			writable: false,
		});

		return mixedClass as any;
	};

export { Mixin, mix };
