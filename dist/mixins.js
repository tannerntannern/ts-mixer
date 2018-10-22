"use strict";
// Based on https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-429426722
Object.defineProperty(exports, "__esModule", { value: true });
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
// Actual mixin implementation
function Mixin() {
    var constructors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        constructors[_i] = arguments[_i];
    }
    var MixedClass = /** @class */ (function () {
        // Apply each of the mixing class constructors
        function MixedClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var _a = 0, constructors_3 = constructors; _a < constructors_3.length; _a++) {
                var constructor = constructors_3[_a];
                constructor.apply(this, args);
            }
        }
        return MixedClass;
    }());
    // Apply prototypes, including those up the chain
    var mixedClassProto = MixedClass.prototype;
    for (var _a = 0, constructors_1 = constructors; _a < constructors_1.length; _a++) {
        var constructor = constructors_1[_a];
        var protoChain = getProtoChain(constructor.prototype);
        // Apply the prototype chain in reverse order, so that old methods don't override newer ones
        for (var i = protoChain.length - 1; i >= 0; i--) {
            Object.assign(mixedClassProto, protoChain[i]);
        }
    }
    var _loop_1 = function (constructor) {
        var _loop_2 = function (prop) {
            if (!MixedClass.hasOwnProperty(prop)) {
                Object.defineProperty(MixedClass, prop, {
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
    // Mix static properties, but in the traditional sense where no static properties can be overridden
    for (var _b = 0, constructors_2 = constructors; _b < constructors_2.length; _b++) {
        var constructor = constructors_2[_b];
        _loop_1(constructor);
    }
    return MixedClass;
}
exports.default = Mixin;
