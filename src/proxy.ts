/**
 * Finds the ingredient with the given prop, searching in reverse order.
 */
const getIngredientWithProp = (prop: string | number | symbol, ingredients: any[]) => {
	for (let i = ingredients.length - 1; i > 0; i --) {
		const ingredient = ingredients[i];
		if (prop in ingredient)  // TODO: will this work for non-enumerable props?
			return ingredient;
	}

	return undefined;
};

/**
 * "Mixes" ingredients by wrapping them in a Proxy.  "Properties" cannot be added or deleted, but they may be modified.
 * Note that modification happens directly on the source object.
 */
export const proxyMix = (ingredients: any[], prototype) => new Proxy({}, {
	getPrototypeOf() {
		return prototype;
	},
	setPrototypeOf() {
		throw Error('Cannot set prototype of Proxies created by ts-mixer');
	},
	isExtensible() {
		return false;
	},
	preventExtensions() {
		return true;
	},
	getOwnPropertyDescriptor(_, prop) {
		return Object.getOwnPropertyDescriptor(getIngredientWithProp(prop, ingredients) || {}, prop);
	},
	defineProperty() {
		throw new Error('Cannot define new properties on Proxies created by ts-mixer');
	},
	has(_, prop) {
		return getIngredientWithProp(prop, ingredients) !== undefined;
	},
	get(_, prop) {
		return (getIngredientWithProp(prop, ingredients) || {})[prop];
	},
	set(_, prop, value) {
		const containingIngredient = getIngredientWithProp(prop, ingredients);
		if (containingIngredient === undefined)
			return false;

		containingIngredient[prop] = value;
		return true;
	},
	deleteProperty() {
		throw new Error('Cannot delete properties on Proxies created by ts-mixer');
	},
	ownKeys() {
		return ingredients
			.map(Object.getOwnPropertySymbols)
			.reduce(
				(prev, curr) => curr.concat(prev.filter(key => curr.indexOf(key) < 0))
			);
	},
});
