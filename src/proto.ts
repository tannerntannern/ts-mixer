/**
 * Returns the full chain of prototypes up until Object.prototype given a starting object.  The order of prototypes will
 * be closest to farthest in the chain.
 */
export const getProtoChain = (obj: object, currentChain: object[] = []): object[] => {
	const proto = Object.getPrototypeOf(obj);
	if (proto === null)
		return currentChain;

	return getProtoChain(proto, [...currentChain, proto]);
};
