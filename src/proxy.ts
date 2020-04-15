import { protoChain } from './util';

/**
 * Finds the ingredient with the given prop, searching in reverse order and breadth-first if searching ingredient
 * prototypes is required.
 */
export const getIngredientWithProp = (prop: string | number | symbol, ingredients: any[]) => {
	const protoChains = ingredients.map(ingredient => protoChain(ingredient));

	// since we search breadth-first, we need to keep track of our depth in the prototype chains
	let protoDepth = 0;

	// not all prototype chains are the same depth, so this remains true as long as at least one of the ingredients'
	// prototype chains has an object at this depth
	let protosAreLeftToSearch = true;

	while (protosAreLeftToSearch) {
		// with the start of each horizontal slice, we assume this is the one that's deeper than any of the proto chains
		protosAreLeftToSearch = false;

		// scan through the ingredients right to left
		for (let i = ingredients.length - 1; i >= 0; i --) {
			const searchTarget = protoChains[i][protoDepth];
			if (searchTarget !== undefined && searchTarget !== null) {
				// if we find something, this is proof that this horizontal slice potentially more objects to search
				protosAreLeftToSearch = true;

				// eureka, we found it
				if (Object.getOwnPropertyDescriptor(searchTarget, prop) != undefined) {
					return protoChains[i][0];
				}
			}
		}

		protoDepth ++;
	}

	return undefined;
};

/**
 * "Mixes" ingredients by wrapping them in a Proxy.  The optional prototype argument allows the mixed object to sit
 * downstream of an existing prototype chain.  Note that "properties" cannot be added, deleted, or modified.
 */
export const proxyMix = (ingredients: any[], prototype = Object.prototype) => new Proxy({}, {
	getPrototypeOf() {
		return prototype;
	},
	setPrototypeOf() {
		throw Error('Cannot set prototype of Proxies created by ts-mixer');
	},
	getOwnPropertyDescriptor(_, prop) {
		return Object.getOwnPropertyDescriptor(getIngredientWithProp(prop, ingredients) || {}, prop);
	},
	defineProperty() {
		throw new Error('Cannot define new properties on Proxies created by ts-mixer');
	},
	has(_, prop) {
		return getIngredientWithProp(prop, ingredients) !== undefined || prototype[prop] !== undefined;
	},
	get(_, prop) {
		return (getIngredientWithProp(prop, ingredients) || prototype)[prop];
	},
	set(_, prop, val) {
		const ingredientWithProp = getIngredientWithProp(prop, ingredients);
		if (ingredientWithProp === undefined)
			throw new Error('Cannot set new properties on Proxies created by ts-mixer');

		ingredientWithProp[prop] = val;
		return true;
	},
	deleteProperty() {
		throw new Error('Cannot delete properties on Proxies created by ts-mixer');
	},
	ownKeys() {
		return ingredients
			.map(Object.getOwnPropertyNames)
			.reduce(
				(prev, curr) => curr.concat(prev.filter(key => curr.indexOf(key) < 0))
			);
	},
});
