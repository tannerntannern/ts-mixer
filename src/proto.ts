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

/**
 * Identifies the nearest ancestor common to all the given objects in their prototype chains.  For most unrelated
 * objects, this function should return Object.
 */
export const nearestCommonAncestor = (...objs: object[]): object => {
	if (objs.length === 0) return undefined;

	let commonAncestorProto = undefined;
	const protoChains = objs.map(obj => getProtoChain(obj));

	while (protoChains.every(protoChain => protoChain.length > 0)) {
		const protos = protoChains.map(protoChain => protoChain.pop());
		const potentialCommonAncestor = protos[0];

		if (protos.every(proto => proto === potentialCommonAncestor))
			commonAncestorProto = potentialCommonAncestor;
		else
			break;
	}

	return commonAncestorProto ? commonAncestorProto.constructor : commonAncestorProto;
};
