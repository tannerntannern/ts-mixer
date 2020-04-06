# ts-mixer
[![npm version](https://badgen.net/npm/v/ts-mixer)](https://npmjs.com/package/ts-mixer)
[![Build Status](https://travis-ci.org/tannerntannern/ts-mixer.svg?branch=master)](https://travis-ci.org/tannerntannern/ts-mixer)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/ts-mixer/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/ts-mixer?branch=master)
[![Minified Size](https://badgen.net/bundlephobia/min/ts-mixer)](https://bundlephobia.com/result?p=ts-mixer)
[![Conventional Commits](https://badgen.net/badge/conventional%20commits/1.0.0/yellow)](https://conventionalcommits.org)

### What is it?
`ts-mixer` is a lightweight package that brings mixins to TypeScript.  Mixins in JavaScript are easy, but TypeScript introduces complications.  `ts-mixer` deals with these complications for you and infers all of the intelligent typing you'd expect, including instance properties, methods, static properties, **generics**, and more.

[Quick start guide](#quick-start)

### Why another Mixin implementation? 
It seems that no one has been able to implement TypeScript mixins gracefully.  Mixins as described by the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are far less than ideal.  Countless online threads feature half-working snippets, each one interesting but lacking in its own way.

My fruitless search has led me to believe that there is no perfect solution with the current state of TypeScript.  Instead, I present a "tolerable" solution that attempts to take the best from the many different implementations while mitigating their flaws as much as possible.

## Features
* can mix plain classes
* can mix classes that extend other classes
* can mix abstract classes (with caveats)
* can mix generic classes (with caveats)
* supports class, method, and property decorators (with caveats)
* proper constructor argument typing (with caveats)
* proper handling of protected/private properties
* proper handling of static properties
* [multiple options](#settings) for mixing (ES6 proxies vs copying properties)

#### Caveats
* Mixing abstract classes requires a bit of a hack that may break in future versions of TypeScript.  See [dealing with abstract classes](#mixing-abstract-classes) below.
* Mixing generic classes requires a more cumbersome notation, but it's still possible.  See [dealing with generics](#mixing-generics) below.
* Using decorators in mixed classes also requires a more cumbersome notation.  See [dealing with decorators](#mixing-with-decorators) below.
* ES6 made it impossible to use `.apply(...)` on class constructors, which means the only way to mix instance properties is to instantiate all the base classes, then copy the properties over to a new object.  This means that (beyond initializing properties on `this`), constructors cannot have [side-effects](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29) involving `this`, or you will get unexpected results.  Note that constructors need not be _completey_ side-effect free; just when dealing with `this`.

## Non-features
* `instanceof` support.  Difficult to implement, and not hard to work around (if even needed at all).

# Quick Start
## Installation
```
$ npm install ts-mixer
```

or if you prefer [Yarn](https://yarnpkg.com):

```
$ yarn add ts-mixer
```

## Examples
### Minimal Example
```typescript
import { Mixin } from 'ts-mixer';

class Foo {
    protected makeFoo() {
        return 'foo';
    }
}

class Bar {
    protected makeBar() {
        return 'bar';
    }
}

class FooBar extends Mixin(Foo, Bar) {
    public makeFooBar() {
        return this.makeFoo() + this.makeBar();
    }
}

const fooBar = new FooBar();

console.log(fooBar.makeFooBar());  // "foobar"
```

[Play with this example](https://www.typescriptlang.org/play/index.html?ssl=1&ssc=1&pln=4&pc=2#code/JYWwDg9gTgLgBAbzgWWAD2AOzgXzgMyghDgHIYBnAWhHQFMpSBuAKBYGMAbAQworgBiECIhZxxcMERh12MgCZwQ3ANZ0hEABQBKURP1wodGAFco2UvmHMxEnC3scefOACFuUPRKkQZcuorKau5QOl4GhsZmFgBGHjb69o5cvPwaIXB0aDKY8vyoGJiaGgA0bh66CLbiYCYxnMDsSqrqwiFhVRHiRqbmcDAAFsAUAHRBrVq6ANT9Q6Pj7dqsiQ5s7BCYFPBWEBkAvHCYdADugm0eOqwcGxQQnHQjnBAA5po7IWMt6RfaS+IA9P84AAiHZxKDAoA)

### Mixing Abstract Classes
Abstract classes, by definition, cannot be constructed, which means they cannot take on the type, `new(...args) => any`, and by extension, are incompatible with `ts-mixer`.  BUT, you can "trick" TypeScript into giving you all the benefits of an abstract class without making it technically abstract.  The trick is just some strategic `// @ts-ignore`'s:

```typescript
import { Mixin } from 'ts-mixer';

// note that Foo is not marked as an abstract class
class Foo {
    // @ts-ignore: "Abstract methods can only appear within an abstract class"
    public abstract makeFoo(): string;
}

class Bar {
    public makeBar() {
        return 'bar';
    }
}

class FooBar extends Mixin(Foo, Bar) {
    // we still get all the benefits of abstract classes here, because TypeScript
    // will still complain if this method isn't implemented
    public makeFoo() {
        return 'foo';
    }
}
```

[Play with this example](https://www.typescriptlang.org/play/index.html#code/JYWwDg9gTgLgBAbzgWWAD2AOzgXzgMyghDgHIYBnAWhHQFMpSBuAKBYHp25MIY64YACwCG8AGIQIcYBW684IYVADWdACZxhs4dmEAjCjCjCAxvBMAbLRRaXrcCVIQs4ruJzgABSlWABzHig6AC44ACIAQQMjU3gQOiEINVkTHTgITAsAT00wMDolOAB3YCEsTV1o4zM4OwoKMJc3MABXPQtgE00q2IVhVUcACgBKUMMoLD9WHDY62QAhQuc3OFb2zr7VRagRxCaV1yCYFqhsUj0lZn3cFhnbK3qHSW24OjQ+TGSUdCxBxwAaODbYZ7FYeIr8QzACwWOB+BKaGECQT8PR0TB0fClWQQfDdca9OZ0WQooKAtGpFoUfgAFSy+QAyiYJmAYNdwdDYVCkSZiGArOVgHiyrJ4okNDJMORpOALHR4pg+GprmsOl1FANJLtlgdDgkTmd8JIrisZjMgA)

Do note that while this does work quite well, it is a bit of a hack and I can't promise that it will continue to work in future TypeScript versions.

### Mixing Generic Classes
Frustratingly, it is _impossible_ for generic parameters to be referenced in base class expressions.  No matter how you try to slice it, you will eventually run into `Base class expressions cannot reference class type parameters.`

The way to get around this is to leverage [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html), and a slightly different mixing function from ts-mixer: `mix`.  It works exactly like `Mixin`, except it's a decorator, which means it doesn't affect the type information of the class being decorated.  See it in action below:

```typescript
import { mix } from 'ts-mixer';

class Foo<T> {
    public fooMethod(input: T): T {
        return input;
    }
}

class Bar<T> {
    public barMethod(input: T): T {
        return input;
    }
}

interface FooBar<T1, T2> extends Foo<T1>, Bar<T2> { }
@mix(Foo, Bar)
class FooBar<T1, T2> {
    public fooBarMethod(input1: T1, input2: T2) {
        return [this.fooMethod(input1), this.barMethod(input2)];
    }
}
```

[Play with this example](https://www.typescriptlang.org/play/index.html?experimentalDecorators=true&ssl=1&ssc=1&pln=22&pc=1#code/JYWwDg9gTgLgBAbziYAPOBfOAzKERwDkMAzgLQqoCmUhA3AFAMDGANgIYklwBiEEAHgAqAPkQM4kuGACuAI1bBmOfgFkqMABYQAJgApgAO1kwAXHCEBKc0PFT7cKBplRDcIycb2MDHyw5ccABC7FDCYggSUrIKSnByoepaugbGMmYW1hZ2DpJOMC5uHuleUj5+RjA02OzMVLz8IWFCAIwANBYATGJUqFWGOtx8gq0iHU3C3YiYDAAClHrD46GW-pxDjaHC7V0RUZIxisrYm1BJ2vrFMC02O1edNp2WObn5hXAA2lrAJAB0JxBzikri1LB1vn8EmcNBdUiYngBdUqScoMIA)

Key takeaways from this example:
* `interface FooBar<T1, T2> extends Foo<T1>, Bar<T2> { }` makes sure `FooBar` has the typing we want, thanks to declaration merging
* `@mix(Foo, Bar)` wires things up "on the JavaScript side", since the interface declaration has nothing to do with runtime behavior.
* The reason we have to use the `mix` decorator is that the typing produced by `Mixin(Foo, Bar)` would conflict with the typing of the interface.  `mix` has no effect "on the TypeScript side," thus avoiding type conflicts.

### Mixing with Decorators
Popular libraries such as [class-validator](https://github.com/typestack/class-validator) and [TypeORM](https://github.com/typeorm/typeorm) use decorators to add functionality.  Unfortunately, `ts-mixer` has no way of knowing what these libraries do with the decorators behind the scenes.  So if you want these decorators to be "inherited" with classes you plan to mix, you first have to wrap them with a special `decorate` function exported by `ts-mixer`.  Here's an example using `class-validator`:

```typescript
import { IsBoolean, IsIn, validate } from 'class-validator';
import { Mixin, decorate } from 'ts-mixer';

class Disposable {
    @decorate(IsBoolean())  // instead of @IsBoolean()
    isDisposed: boolean = false;
}

class Statusable {
    @decorate(IsIn(['red', 'green']))  // instead of @IsIn(['red', 'green'])
    status: string = 'green';
}

class ExtendedObject extends Mixin(Disposable, Statusable) {}

const extendedObject = new ExtendedObject();
extendedObject.status = 'blue';

validate(extendedObject).then(errors => {
    console.log(errors);
});
```

## Settings
ts-mixer has multiple strategies for mixing classes which can be configured by modifying `settings` from ts-mixer.  For example:

```typescript
import { settings, Mixin } from 'ts-mixer';

settings.prototypeStrategy = 'proxy';

// then use `Mixin` as normal...
```

### `settings.prototypeStrategy`
* Determines how ts-mixer will mix class prototypes together
* Possible values:
    - `'copy'` (default) - Copies all methods from the classes being mixed into a new prototype object.  (This will include all methods up the prototype chains as well.)  This is the default for ES5 compatibility, but it has the downside of stale references.  For example, if you mix `Foo` and `Bar` to make `FooBar`, then redefine a method on `Foo`, `FooBar` will not have the latest methods from `Foo`.  If this is not a concern for you, `'copy'` is the best value for this setting.
    - `'proxy'` - Uses an ES6 Proxy to "soft mix" prototypes.  Unlike `'copy'`, updates to the base classes _will_ be reflected in the mixed class, which may be desirable.  The downside is that method access is not as performant, nor is it ES5 compatible.

### `settings.staticsStrategy`
* Determines how static properties are inherited
* Possible values:
    - `'copy'` (default) - Simply copies all properties (minus `prototype`) from the base classes/constructor functions onto the mixed class.  Like `settings.prototypeStrategy = 'copy'`, this strategy also suffers from stale references, but shouldn't be a concern if you don't redefine static methods after mixing.
    - `'proxy'` - Similar to `settings.prototypeStrategy`, proxy's static method access to base classes.  Has the same benefits/downsides.

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [tannerntannern](https://github.com/tannerntannern)
