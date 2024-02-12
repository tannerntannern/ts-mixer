import { protoChain } from './util';
import { Class } from './types';

// Keeps track of constituent classes for every mixin class created by ts-mixer.
const mixins = new WeakMap<any, Function[]>();

export const getMixinsForClass = (clazz: Class) => mixins.get(clazz);

export const registerMixins = (mixedClass: any, constituents: Function[]) =>
	mixins.set(mixedClass, constituents);

export const hasMixin = <M>(
	instance: any,
	mixin: abstract new (...args) => M
): instance is M => {
	if (instance instanceof mixin) return true;

	const constructor = instance.constructor;

	const visited = new Set<Function>();
	let frontier = new Set<Function>();
	frontier.add(constructor);

	while (frontier.size > 0) {
		// check if the frontier has the mixin we're looking for.  if not, we can say we visited every item in the frontier
		if (frontier.has(mixin)) return true;
		frontier.forEach((item) => visited.add(item));

		// build a new frontier based on the associated mixin classes and prototype chains of each frontier item
		const newFrontier = new Set<Function>();
		frontier.forEach((item) => {
			const itemConstituents =
				mixins.get(item) ??
				protoChain(item.prototype)
					.map((proto) => proto.constructor)
					.filter((item) => item !== null);
			if (itemConstituents)
				itemConstituents.forEach((constituent) => {
					if (!visited.has(constituent) && !frontier.has(constituent))
						newFrontier.add(constituent);
				});
		});

		// we have a new frontier, now search again
		frontier = newFrontier;
	}

	// if we get here, we couldn't find the mixin anywhere in the prototype chain or associated mixin classes
	return false;
};
