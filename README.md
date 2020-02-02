# ts-mixer
[![npm version](https://badgen.net/npm/v/ts-mixer)](https://npmjs.com/package/ts-mixer)
[![Build Status](https://travis-ci.org/tannerntannern/ts-mixer.svg?branch=master)](https://travis-ci.org/tannerntannern/ts-mixer)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/ts-mixer/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/ts-mixer?branch=master)
[![Minified Size](https://badgen.net/bundlephobia/min/ts-mixer)](https://bundlephobia.com/result?p=ts-mixer)
[![Conventional Commits](https://badgen.net/badge/conventional%20commits/1.0.0/yellow)](https://conventionalcommits.org)

### What is it?
`ts-mixer` is a lightweight package that brings mixins to TypeScript.  Mixins in JavaScript are easy, but TypeScript introduces complications.  `ts-mixer` deals with these complications for you and infers all of the intelligent typing you'd expect, including instance properties, methods, static properties, **generics**, and more.

[Quick start guide](#getting-started)

### Why another Mixin implementation? 
It seems that no one has been able to implement TypeScript mixins gracefully.  Mixins as described by the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are far less than ideal.  Countless online threads feature half-working snippets, each one interesting but lacking in its own way.

My fruitless search has led me to believe that there is no perfect solution with the current state of TypeScript.  Instead, I present a "tolerable" solution that attempts to take the best from the many different implementations while mitigating their flaws as much as possible.

## Features
* dead-simple API
* mix plain classes
* mix classes that extend other classes
* mix abstract classes (with caveats)
* mix generic classes (with caveats)
* proper handling of protected/private properties
* proper handling of static properties

#### Caveats
* Mixing abstract classes requires a bit of a hack that may break in future versions of TypeScript.  See [dealing with abstract classes](#dealing-with-abstract-classes) below.
* Mixing generic classes requires a more cumbersome notation, but it's still possible.  See [dealing with generics](#dealing-with-generics) below.

## Non-features
* `instanceof` support;  Because this library is intended for use with TypeScript, running an `instanceof` check is generally not needed.  Additionally, adding support can have [negative effects on performance](https://stackoverflow.com/a/1919670).  See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
for more information.

# Getting Started
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

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [tannerntannern](https://github.com/tannerntannern)
