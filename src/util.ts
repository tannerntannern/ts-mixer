import { proxyMix } from './proxy';

/**
 * Utility function that works like `Object.apply`, but copies getters and setters properly as well.  Additionally gives
 * the option to exclude properties by name.
 */
export const copyProps = (dest: object, src: object, exclude: string[] = []) => {
	const props = Object.getOwnPropertyDescriptors(src);
	for (let prop of exclude) delete props[prop];
	Object.defineProperties(dest, props);
};

/**
 * Returns the full chain of prototypes up until Object.prototype given a starting object.  The order of prototypes will
 * be closest to farthest in the chain.
 */
export const protoChain = (obj: object, currentChain: object[] = [obj]): object[] => {
	const proto = Object.getPrototypeOf(obj);
	if (proto === null)
		return currentChain;

	return protoChain(proto, [...currentChain, proto]);
};

/**
 * Identifies the nearest ancestor common to all the given objects in their prototype chains.  For most unrelated
 * objects, this function should return Object.prototype.
 */
export const nearestCommonProto = (...objs: object[]): Function => {
	if (objs.length === 0) return undefined;

	let commonProto = undefined;
	const protoChains = objs.map(obj => protoChain(obj));

	while (protoChains.every(protoChain => protoChain.length > 0)) {
		const protos = protoChains.map(protoChain => protoChain.pop());
		const potentialCommonProto = protos[0];

		if (protos.every(proto => proto === potentialCommonProto))
			commonProto = potentialCommonProto;
		else
			break;
	}

	return commonProto;
};

/**
 * Creates a new prototype object that is a mixture of the given prototypes.  The mixing is achieved by first
 * identifying the nearest common ancestor and using it as the prototype for a new object.  Then all properties/methods
 * downstream of this prototype (ONLY downstream) are copied into the new object.
 *
 * The resulting prototype is more performant than softMixProtos(...), as well as ES5 compatible.  However, it's not as
 * flexible as updates to the source prototypes aren't captured by the mixed result.  See softMixProtos for why you may
 * want to use that instead.
 */
export const hardMixProtos = (ingredients: any[], constructor: Function, exclude: string[] = []): object => {
	const base = nearestCommonProto(...ingredients);
	const mixedProto = Object.create(base);

	// Keeps track of prototypes we've already visited to avoid copying the same properties multiple times.  We init the
	// list with the proto chain below the nearest common ancestor because we don't want any of those methods mixed in
	// when they will already be accessible via prototype access.
	const visitedProtos = protoChain(base);

	for (let prototype of ingredients) {
		let protos = protoChain(prototype);

		// Apply the prototype chain in reverse order so that old methods don't override newer ones.
		for (let i = protos.length - 1; i >= 0; i--) {
			let newProto = protos[i];

			if (visitedProtos.indexOf(newProto) === -1) {
				copyProps(mixedProto, newProto, ['constructor', ...exclude]);
				visitedProtos.push(newProto);
			}
		}
	}

	mixedProto.constructor = constructor;

	return mixedProto;
};

/**
 * Creates a new proxy-prototype object that is a "soft" mixture of the given prototypes.  The mixing is achieved by
 * proxying all property access to the ingredients.  This is not ES5 compatible and less performant.  However, any
 * changes made to the source prototypes will be reflected in the proxy-prototype, which may be desirable.
 */
export const softMixProtos = (ingredients: any[], constructor: Function): object => {
	return proxyMix([...ingredients, { constructor }], null);
};
