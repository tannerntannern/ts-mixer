/**
 * Basic constructor type
 */
declare type Constructor<T> = new (...args: any[]) => T;
/**
 * The main mixin function; takes a number of constructors, and returns a new class that
 * 	1) applies each of the given constructors in its own constructor
 * 	2) applies each prototype (and parent prototypes) of the given constructors to its own prototype
 * 	3) links any static properties on the given constructors to the class via getters and setters
 *
 * Note that there are overloads for up to 10 classes.  If you go beyond 10 classes the "JavaScript side" will still
 * work, but the "TypeScript side" will not.
 */
declare function Mixin<C1>(ctor1: Constructor<C1>): Constructor<C1>;
declare function Mixin<C1, C2>(ctor1: Constructor<C1>, ctor2: Constructor<C2>): Constructor<C1 & C2>;
declare function Mixin<C1, C2, C3>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>): Constructor<C1 & C2 & C3>;
declare function Mixin<C1, C2, C3, C4>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>): Constructor<C1 & C2 & C3 & C4>;
declare function Mixin<C1, C2, C3, C4, C5>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>): Constructor<C1 & C2 & C3 & C4 & C5>;
declare function Mixin<C1, C2, C3, C4, C5, C6>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>): Constructor<C1 & C2 & C3 & C4 & C5 & C6>;
declare function Mixin<C1, C2, C3, C4, C5, C6, C7>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7>;
declare function Mixin<C1, C2, C3, C4, C5, C6, C7, C8>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>, ctor8: Constructor<C8>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8>;
declare function Mixin<C1, C2, C3, C4, C5, C6, C7, C8, C9>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>, ctor8: Constructor<C8>, ctor9: Constructor<C9>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9>;
declare function Mixin<C1, C2, C3, C4, C5, C6, C7, C8, C9, C10>(ctor1: Constructor<C1>, ctor2: Constructor<C2>, ctor3: Constructor<C3>, ctor4: Constructor<C4>, ctor5: Constructor<C5>, ctor6: Constructor<C6>, ctor7: Constructor<C7>, ctor8: Constructor<C8>, ctor9: Constructor<C9>, ctor10: Constructor<C10>): Constructor<C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9 & C10>;
/**
 * A decorator version of the `Mixin` function.  Instead of applying mixins like this,
 *
 * 	class MyClass extends Mixin(Mixin1, Mixin2, Mixin3) {}
 *
 * you can apply mixins like this instead:
 *
 * 	@MixinDecorator(Mixin1, Mixin2, Mixin3)
 * 	class MyClass {}
 *
 * 	// This line is necessary for the typings to work
 * 	interface MyClass extends Mixin1, Mixin2, Mixin3 {}
 *
 * The main reason you might want to use this over `Mixin` is for mixing generic classes.  See the main README for more
 * information.
 */
declare function MixinDecorator(...constructors: Constructor<any>[]): <T>(baseClass: T) => T;
export { Mixin, MixinDecorator };
