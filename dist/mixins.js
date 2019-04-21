"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isClass = require("is-class");
/**
 * Utility function that returns the full chain of prototypes (excluding Object.prototype) from the given prototype.
 * The order will be [proto, protoParent, protoGrandparent, ...]
 */
function getProtoChain(proto) {
    var protoChain = [];
    while (proto !== Object.prototype) {
        protoChain.push(proto);
        proto = Object.getPrototypeOf(proto);
    }
    return protoChain;
}
function Mixin() {
    var ingredients = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ingredients[_i] = arguments[_i];
    }
    // Start building a class that represents the mixture of the given Base and Class
    var Mixed = /** @class */ (function () {
        function Mixed() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var _a = 0, ingredients_3 = ingredients; _a < ingredients_3.length; _a++) {
                var constructor = ingredients_3[_a];
                // If the constructor is a callable JS function, we would prefer to apply it directly to `this`,
                if (!isClass(constructor))
                    constructor.apply(this, args);
                // but if it's an ES6 class, we can't call it directly so we have to instantiate it and copy props
                else
                    Object.assign(this, new (constructor.bind.apply(constructor, [void 0].concat(args)))());
            }
        }
        return Mixed;
    }());
    // Apply prototypes, including those up the chain
    var mixedClassProto = Mixed.prototype, appliedPrototypes = [];
    for (var _a = 0, ingredients_1 = ingredients; _a < ingredients_1.length; _a++) {
        var item = ingredients_1[_a];
        var protoChain = getProtoChain(item.prototype);
        // Apply the prototype chain in reverse order, so that old methods don't override newer ones; also make sure
        // that the same prototype is never applied more than once.
        for (var i = protoChain.length - 1; i >= 0; i--) {
            var newProto = protoChain[i];
            if (appliedPrototypes.indexOf(newProto) === -1) {
                Object.assign(mixedClassProto, protoChain[i]);
                appliedPrototypes.push(newProto);
            }
        }
    }
    var _loop_1 = function (constructor) {
        var _loop_2 = function (prop) {
            if (!Mixed.hasOwnProperty(prop)) {
                Object.defineProperty(Mixed, prop, {
                    get: function () { return constructor[prop]; },
                    set: function (val) { constructor[prop] = val; },
                    enumerable: true,
                    configurable: false
                });
            }
        };
        for (var prop in constructor) {
            _loop_2(prop);
        }
    };
    // Mix static properties by linking to the original static props with getters/setters
    for (var _b = 0, ingredients_2 = ingredients; _b < ingredients_2.length; _b++) {
        var constructor = ingredients_2[_b];
        _loop_1(constructor);
    }
    return Mixed;
}
exports.Mixin = Mixin;
/**
 * A decorator version of the `Mixin` function.  You'll want to use this instead of `Mixin` for mixing generic classes.
 */
var mix = function () {
    var ingredients = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ingredients[_i] = arguments[_i];
    }
    // @ts-ignore
    return function (baseClass) { return Mixin.apply(void 0, [baseClass].concat(ingredients)); };
};
exports.mix = mix;
