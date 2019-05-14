# ts-mixer
[![npm version](https://badgen.net/npm/v/ts-mixer)](https://npmjs.com/package/ts-mixer)
[![Build Status](https://travis-ci.org/tannerntannern/ts-mixer.svg?branch=master)](https://travis-ci.org/tannerntannern/ts-mixer)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/ts-mixer/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/ts-mixer?branch=master)
[![Minified Size](https://badgen.net/bundlephobia/min/ts-mixer)](https://bundlephobia.com/result?p=ts-mixer)

### What is it?
`ts-mixer` is a lightweight package that brings mixins to TypeScript.  Mixins in JavaScript are easy, but TypeScript introduces complications.  `ts-mixer` deals with these complications for you and infers all of the intelligent typing you'd expect, including instance properties, methods, static properties, **generics**, and more.

### Why another Mixin implementation? 
It seems that no one has been able to implement TypeScript mixins gracefully.  Mixins as described by the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are far less than ideal.  Countless online threads feature half-working snippets, each one simultaneously elegant but lacking in its own way.

My fruitless search has led me to believe that there is no perfect solution with the current state of TypeScript.  Instead, I present a "tolerable" solution that attempts to take the best from the many different implementations while mitigating their flaws as much as possible.

## Features
* Support for mixing plain TypeScript classes
* Support for mixing classes that extend other classes
* Support for protected and private properties
* **Support for classes with generics**[¹](#caveats)
* Automatic inference of the mixed class type[¹](#caveats)
* Proper handling of static properties

#### Caveats
1. Some mixin implementations require you to do something like `Mixin<A & B>(A, B)` in
order for the types to work correctly.  ts-mixer is able to infer these types, so you can
just do `Mixin(A, B)`, except when generics are involved.  See
[Dealing with Generics](#dealing-with-generics).
2. Due to a bug in the TypeScript compiler, this package only appears to work on TypeScript 3.4.4 and beyond.  With that said, it may still to simply use the package instead of compiling it yourself, which is where I ran into issues, but I did not test this extensively.

## Non-features
* `instanceof` support;  Because this library is intended for use with TypeScript, running
an `instanceof` check is generally not needed.  Additionally, adding support can have
[negative effects on performance](https://stackoverflow.com/a/1919670).  See the
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
for more information.

# Getting Started
## Installation
`npm i --save ts-mixer` or `yarn add ts-mixer`

## Documentation
If you're looking for the API documentation, [go here](https://tannerntannern.github.io/ts-mixer).
If you just need a few tips to get started, keep reading.

## Examples
### Basic Example
```typescript
import {Mixin} from 'ts-mixer';

class Person {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}
}

class RunnerMixin {
	protected runSpeed: number = 10;

	public run(){
		console.log('They are running at', this.runSpeed, 'ft/sec');
	}
}

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		console.log('They are jumping', this.jumpHeight, 'ft in the air');
	}
}

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin) {
	public longJump() {
		console.log(this.name, 'is stepping up to the event.');
		
		this.run();
		this.jump();
		
		console.log('They landed', this.runSpeed * this.jumpHeight, 'ft from the start!');
	}
}
```

### Dealing with Generics
Normally, the `Mixin` function is able to figure out the class types without help.  However, when generics are involved, the `Mixin` function is not able to correctly infer the type parameters.  Consider the following:

```typescript
import {Mixin} from 'ts-mixer';

class GenClassA<T> {
	methodA(input: T) {}
}
class GenClassB<T> {
	methodB(input: T) {}
}
```

Now let's say that we want to mix these two generic classes together, like so:

```typescript
class Mixed<A, B> extends Mixin(GenClassA, GenClassB) {}
```

But we run into trouble here because we can't pass our type parameters along with the arguments to the `Mixin` function.  To solve this issue, we can make simultaneous use of class decorators and interface merging to create the proper class typing.  Consider the following:

```typescript
import {mix} from 'ts-mixer';

@mix(GenClassA, GenClassB)
class Mixed<A, B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
```

Note the `mix`, which is simply the `Mixin` function in [class-decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators) form.  Decorators have the annoying property that even though they may modify the shape of the class they decorate "on the JavaScript side," the types don't update "on the TypeScript side."  So as far as the TypeScript compiler is concerned in the example above, class `Mixed` only has one method, even though the decorator is really adding methods from the mixed generic classes.

How do we convince TypeScript that `Mixed` has the additional methods?  An attempt at a solution might look like this:

```typescript
@mix(GenClassA, GenClassB)
class Mixed<A, B> implements GenClassA<A>, GenClassB<B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
```

But now TypeScript will complain that `Mixed` doesn't implement `GenClassA` and `GenClassB` correctly, because it can't see the changes made by the decorator.  Instead, we can use [interface merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces):

```typescript
@mix(GenClassA, GenClassB)
class Mixed<A, B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
interface Mixed<A, B> extends GenClassA<A>, GenClassB<B> {}
```

Boom.  Generic mixins solved.

#### Important Note
It's worth noting that it's _only through_ TypeScript's failure to consider decorator return types _in conjunction_ with interface merging that this works.  If we attempted interface merging without the decorator, we would run into trouble:

```typescript
interface Mixed<A, B> extends GenClassA<A>, GenClassB<B> {}
class Mixed<A, B> extends Mixin(GenClassA, GenClassB) {
	newMethod(a: A, b: B) {}
}
```

```
Error:TS2320: Interface 'Mixed<A, B>' cannot simultaneously extend types 'GenClassA<{}> & GenClassB<{}>' and 'GenClassA<A>'.
Named property 'methodA' of types 'GenClassA<{}> & GenClassB<{}>' and 'GenClassA<A>' are not identical.
```

We get this error because when generic classes are fed to the `Mixin` function, any generic parameters default to `{}`, since TypeScript can't infer them.  Unfortunately, these incorrect defaults can't be overridden with interface merging.  Even if you try to `@ts-ignore` it, the TypeScript will prefer the types of the `Mixin` function over those of the interface.

In other words, use the decorator instead!

# Contributing
All contributions are welcome!  To get started, simply fork and clone the repo, run `yarn install`, and get to work.  Once you have something you'd like to contribute, be sure to run `yarn lint && yarn test` locally, then submit a PR.

Tests are very important to consider and I will not accept any PRs that are poorly tested.  Keep the following in mind:
* If you add a new feature, please make sure it's covered by a test case.  Typically this should get a dedicated `*.test.ts` file in the `test` directory, so that all of the nuances of the feature can be adequately covered.
* If you are contributing a bug fix, you must also write at least one test to verify that the bug is fixed.  If the bug is directly related to an existing feature, try to include the test in the relevant test file.  If the bug is highly specific, it may deserve a dedicated file; use discretion.

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [tannerntannern](https://github.com/tannerntannern)
