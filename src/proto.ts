/**
 * Returns the full chain of prototypes up until Object.prototype given a starting object.  The order of prototypes will
 * be closest to farthest in the chain.
 */
export const protoChain = (obj: object, currentChain: object[] = []): object[] => {
	const proto = Object.getPrototypeOf(obj);
	if (proto === null)
		return currentChain;

	return protoChain(proto, [...currentChain, proto]);
};

/**
 * Similar to protoChain, but returns a list of classes rather than prototypes.
 */
export const ancestors = (obj: object) => protoChain(obj).map(proto => proto.constructor);

/**
 * Identifies the nearest ancestor common to all the given objects in their prototype chains.  For most unrelated
 * objects, this function should return Object.
 */
export const nearestCommonAncestor = (...objs: object[]): Function => {
	if (objs.length === 0) return undefined;

	let commonAncestor = undefined;
	const ancestorChains = objs.map(obj => ancestors(obj));

	while (ancestorChains.every(ancestorChain => ancestorChain.length > 0)) {
		const ancestors = ancestorChains.map(ancestorChain => ancestorChain.pop());
		const potentialCommonAncestor = ancestors[0];

		if (ancestors.every(ancestor => ancestor === potentialCommonAncestor))
			commonAncestor = potentialCommonAncestor;
		else
			break;
	}

	return commonAncestor;
};

/**
 * Computes the ancestor chain for each of the given objects and filters out any ancestors that are common to each.  The
 * results is a list of ancestor chains in the same order as the given objects.
 */
export const uniqueAncestors = (...objs: object[]): Function[][] => {
	if (objs.length === 0) return [];

	const ancestorChains = objs.map(obj => ancestors(obj));
	if (objs.length === 1) return ancestorChains;

	// the number of filtered ancestors can't be larger than the total ancestors in any one of the chains, so we just
	// use the first one to check against the others
	const firstAncestorChain = ancestorChains[0].slice();
	for (let potentialSharedAncestor of firstAncestorChain) {
		const indicesOfSharedAncestor = ancestorChains.map(ancestorChain => ancestorChain.indexOf(potentialSharedAncestor));
		const everyChainContainsPotentialSharedAncestor = indicesOfSharedAncestor.every(index => index != -1);

		if (everyChainContainsPotentialSharedAncestor) {
			for (let i = 0; i < ancestorChains.length; i ++) {
				const ancestorChain = ancestorChains[i];
				const indexInAncestorChain = indicesOfSharedAncestor[i];
				ancestorChain.splice(indexInAncestorChain, 1);
			}
		}
	}

	return ancestorChains;
};
