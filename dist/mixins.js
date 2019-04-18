"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var mixedClassProto = MixedClass.prototype, appliedPrototypes = [];
    for (var _a = 0, constructors_1 = constructors; _a < constructors_1.length; _a++) {
        var constructor = constructors_1[_a];
        var protoChain = getProtoChain(constructor.prototype);
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
    // Mix static properties by linking to the original static props with getters/setters
    for (var _b = 0, constructors_2 = constructors; _b < constructors_2.length; _b++) {
        var constructor = constructors_2[_b];
        _loop_1(constructor);
    }
    return MixedClass;
}
exports.Mixin = Mixin;
/**
 * A decorator version of the `Mixin` function.  Instead of applying mixins like this,
 *
 * 	class MyClass extends Mixin(Mixin1, Mixin2, Mixin3) {}
 *
 * you can apply mixins like this instead:
 *
 * 	@mix(Mixin1, Mixin2, Mixin3)
 * 	class MyClass {}
 *
 * 	// This line is necessary for the typings to work
 * 	interface MyClass extends Mixin1, Mixin2, Mixin3 {}
 *
 * The main reason you might want to use this over `Mixin` is for mixing generic classes.  See the main README for more
 * information.
 */
function MixinDecorator() {
    var constructors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        constructors[_i] = arguments[_i];
    }
    return function (baseClass) {
        // @ts-ignore
        return /** @class */ (function (_super) {
            __extends(Mixed, _super);
            function Mixed() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Mixed;
        }(Mixin.apply(void 0, [baseClass].concat(constructors))));
    };
}
exports.MixinDecorator = MixinDecorator;
