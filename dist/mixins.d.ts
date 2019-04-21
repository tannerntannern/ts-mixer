/**
 * Shorthand Array<any> type.
 */
declare type Arr = Array<any>;
/**
 * A rigorous type alias for a class.
 */
declare type Class<CtorArgs extends Arr = Arr, InstanceType = {}, StaticType = {}> = {
    new (...args: CtorArgs): InstanceType;
} & {
    [K in keyof StaticType]: StaticType[K];
};
/**
 * Mixes a number of classes together.  Overloads are provided for up to 10 inputs, which should be more than plenty.
 */
declare function Mixin<A extends Arr, C1, S1>(c1: Class<A, C1, S1>): Class<A, C1, S1>;
declare function Mixin<A extends Arr, C1, S1, C2, S2>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>): Class<A, C1 & C2, S1 & S2>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>): Class<A, C1 & C2 & C3, S1 & S2 & S3>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>): Class<A, C1 & C2 & C3 & C4, S1 & S2 & S3 & S4>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4, C5, S5>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>): Class<A, C1 & C2 & C3 & C4 & C5, S1 & S2 & S3 & S4 & S5>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4, C5, S5, C6, S6>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>, c6: Class<A, C6, S6>): Class<A, C1 & C2 & C3 & C4 & C5 & C6, S1 & S2 & S3 & S4 & S5 & S6>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4, C5, S5, C6, S6, C7, S7>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>, c6: Class<A, C6, S6>, c7: Class<A, C7, S7>): Class<A, C1 & C2 & C3 & C4 & C5 & C6 & C7, S1 & S2 & S3 & S4 & S5 & S6 & S7>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4, C5, S5, C6, S6, C7, S7, C8, S8>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>, c6: Class<A, C6, S6>, c7: Class<A, C7, S7>, c8: Class<A, C8, S8>): Class<A, C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>;
declare function Mixin<A extends Arr, C1, P1, S1, C2, S2, C3, S3, C4, S4, C5, S5, C6, S6, C7, S7, C8, S8, C9, S9>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>, c6: Class<A, C6, S6>, c7: Class<A, C7, S7>, c8: Class<A, C8, S8>, c9: Class<A, C9, S9>): Class<A, C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9>;
declare function Mixin<A extends Arr, C1, S1, C2, S2, C3, S3, C4, S4, C5, S5, C6, S6, C7, S7, C8, S8, C9, S9, C10, S10>(c1: Class<A, C1, S1>, c2: Class<A, C2, S2>, c3: Class<A, C3, S3>, c4: Class<A, C4, S4>, c5: Class<A, C5, S5>, c6: Class<A, C6, S6>, c7: Class<A, C7, S7>, c8: Class<A, C8, S8>, c9: Class<A, C9, S9>, c10: Class<A, C10, S10>): Class<A, C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9 & C10, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10>;
/**
 * A decorator version of the `Mixin` function.  You'll want to use this instead of `Mixin` for mixing generic classes.
 */
declare const mix: (...ingredients: Class<any[], {}, {}>[]) => (baseClass: any) => any;
export { Mixin, mix };
