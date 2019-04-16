import * as isClass from 'is-class';

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

/**
 * Shorthand Array<any> type.
 */
type Arr = Array<any>;

/**
 * A rigorous type alias for a class.
 */
type Class<CtorArgs extends Arr = Arr, InstanceType = {}, ProtoType = {}, StaticType = {}> =
	{prototype: ProtoType, new(...args: CtorArgs): InstanceType} & StaticType;

/**
 * Mixes a number of classes together.  Overloads are provided for up to 10 inputs, which should be more than plenty.
 */
function Mixin<A extends Arr, C1,P1,S1>(
	c1: Class<A,C1,P1,S1>,
): Class<A,C1,P1,S1>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
): Class<A, C1&C2, P1&P2, S1&S2>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>
): Class<A, C1&C2&C3, P1&P2&P3, S1&S2&S3>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
): Class<A, C1&C2&C3&C4, P1&P2&P3&P4, S1&S2&S3&S4>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
): Class<A, C1&C2&C3&C4&C5, P1&P2&P3&P4&P5, S1&S2&S3&S4&S5>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5, C6,P6,S6>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
	c6: Class<A,C6,P6,S6>
): Class<A, C1&C2&C3&C4&C5&C6, P1&P2&P3&P4&P5&P6, S1&S2&S3&S4&S5&S6>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5, C6,P6,S6, C7,P7,S7>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
	c6: Class<A,C6,P6,S6>,
	c7: Class<A,C7,P7,S7>,
): Class<A, C1&C2&C3&C4&C5&C6&C7, P1&P2&P3&P4&P5&P6&P7, S1&S2&S3&S4&S5&S6&S7>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5, C6,P6,S6, C7,P7,S7, C8,P8,S8>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
	c6: Class<A,C6,P6,S6>,
	c7: Class<A,C7,P7,S7>,
	c8: Class<A,C8,P8,S8>,
): Class<A, C1&C2&C3&C4&C5&C6&C7&C8, P1&P2&P3&P4&P5&P6&P7&P8, S1&S2&S3&S4&S5&S6&S7&S8>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5, C6,P6,S6, C7,P7,S7, C8,P8,S8, C9,P9,S9>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
	c6: Class<A,C6,P6,S6>,
	c7: Class<A,C7,P7,S7>,
	c8: Class<A,C8,P8,S8>,
	c9: Class<A,C9,P9,S9>,
): Class<A, C1&C2&C3&C4&C5&C6&C7&C8&C9, P1&P2&P3&P4&P5&P6&P7&P8&P9, S1&S2&S3&S4&S5&S6&S7&S8&S9>;

function Mixin<A extends Arr, C1,P1,S1, C2,P2,S2, C3,P3,S3, C4,P4,S4, C5,P5,S5, C6,P6,S6, C7,P7,S7, C8,P8,S8, C9,P9,S9, C10,P10,S10>(
	c1: Class<A,C1,P1,S1>,
	c2: Class<A,C2,P2,S2>,
	c3: Class<A,C3,P3,S3>,
	c4: Class<A,C4,P4,S4>,
	c5: Class<A,C5,P5,S5>,
	c6: Class<A,C6,P6,S6>,
	c7: Class<A,C7,P7,S7>,
	c8: Class<A,C8,P8,S8>,
	c9: Class<A,C9,P9,S9>,
	c10: Class<A,C10,P10,S10>,
): Class<A, C1&C2&C3&C4&C5&C6&C7&C8&C9&C10, P1&P2&P3&P4&P5&P6&P7&P8&P9&P10, S1&S2&S3&S4&S5&S6&S7&S8&S9&S10>;

function Mixin(...ingredients: Class[]) {
	// Start building a class that represents the mixture of the given Base and Class
	class Mixed {
		constructor(...args) {
			for (const constructor of ingredients) {
				// If the constructor is a callable JS function, we would prefer to apply it directly to `this`,
				if (!isClass(constructor)) constructor.apply(this, args);

				// but if it's an ES6 class, we can't call it directly so we have to instantiate it and copy props
				else Object.assign(this, new constructor(...args));
			}
		}
	}

	// Apply prototypes, including those up the chain
	let mixedClassProto = Mixed.prototype, appliedPrototypes = [];
	for (let item of ingredients) {
		let protoChain = getProtoChain(item.prototype as any);

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
	for (let constructor of ingredients) {
		for (let prop in constructor) {
			if (!Mixed.hasOwnProperty(prop)) {
				Object.defineProperty(Mixed, prop, {
					get() { return constructor[prop]; },
					set(val) { constructor[prop] = val; },
					enumerable: true,
					configurable: false
				});
			}
		}
	}

	return Mixed as any;
}

/**
 * A decorator version of the `Mixin` function you might want to use this over `Mixin` for mixing generic classes.
 *
 * TODO: give this a better name
 */
const MixinDecorator = (...ingredients: Class[]) => baseClass => class Mixed extends Mixin(baseClass, ...ingredients) {};

export {Mixin, MixinDecorator};
