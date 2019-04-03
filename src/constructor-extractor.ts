/**
 * Determines whether the given function is an ES6 class.
 */
export const isEs6Class = (clazz: Function): boolean => {
	try {
		clazz();
		return false;
	} catch (e) {
		return e instanceof TypeError && e.message.indexOf('without \'new\'') !== -1;
	}
};

/**
 * Extracts a constructor function from the given ES6 class.  In ES6, calling a class constructor as a function without
 * the `new` keyword causes an unavoidable error which makes certain mixin implementations impossible.  This function
 * uses `.toString()` to extract a callable function that is identical to the given ES6 class constructor.  Note that
 * this function ONLY extracts the constructor; it does not wire up the prototype, static properties, etc.
 */
export const extractConstructor = (clazz: Function): Function => {
	// Simply return if the given function is not an ES6 class
	if (!isEs6Class(clazz)) return clazz;

	// Get the class's source code
	const source = clazz.toString();
	const hasConstructor = source.indexOf('constructor') !== -1;
	const hasExtends = source.indexOf('extends') !== -1;

	if (!hasConstructor){
		if (!hasExtends) {
			return function(){};
		} else {
			return extractConstructor(clazz.prototype.constructor);
		}
	} else {
		// TODO: ...
	}
};
