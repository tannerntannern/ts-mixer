# ts-mixer
[![Build Status](https://travis-ci.org/tannerntannern/ts-mixer.svg?branch=master)](https://travis-ci.org/tannerntannern/ts-mixer)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/ts-mixer/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/ts-mixer?branch=master)
[![dependencies Status](https://david-dm.org/tannerntannern/ts-mixer/status.svg)](https://david-dm.org/tannerntannern/ts-mixer)

It seems that no one has been able to provide an acceptable way to gracefully implement
the mixin pattern with TypeScript.  Mixins as described by the
[TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are far less
than ideal.  Countless online threads feature half-working snippets.  Some are elegant,
but fail to work properly with static properties.  Others solve static properties, but
they don't work well with generics.  Some are memory-optimized, but force you to write the
mixins in an awkward and cumbersome format.

My fruitless search has led me to believe that there is no perfect solution with the
current state of TypeScript.  Instead, I present a "tolerable" solution that attempts to
take the best from the many different implementations while mitigating their flaws as much
as possible.

## Features
* Support for mixing plain TypeScript classes
* Support for mixing classes that extend other classes
* Support for protected and private properties
* Automatic inference of the mixed class type[¹](#caveats)
* Proper handling of static properties[²](#caveats)
* Support for classes with generics[¹](#caveats)
* <del>Proper typing of the mixed class constructor[³](#caveats)</del>

#### Caveats
1. Some mixin implementations require you to do something like `Mixin<A & B>(A, B)` in
order for the types to work correctly.  ts-mixer is able to infer these types, so you can
just do `Mixin(A, B)`... except when generics are involved.  See
[Dealing with Generics](#dealing-with-generics).
2. Due to the way constructor types work in TypeScript, it's impossible to specify a type
that is both a constructor and has specific properties.  Static properties are still
accessible "on the JavaScript side," but you have to make some type assertions to convince
TypeScript that you can access them.  See
[Dealing with Static Properties](#dealing-with-static-properties).
3. <del>Unlike some mixin implementations, ts-mixer assigns a constructor signature to the
mixed class.  Because the mixing classes need to have compatible constructor signatures,
the first class passed to the `Mixin` function is used as the model for the signature.</del>

# Getting Started
## Installation
`npm i --save ts-mixer`

## Examples
### Basic Example
```typescript
class Person {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}
}

class RunnerMixin {
	protected runSpeed: number = 10;

	public run(){
		return 'They are running at ' + this.runSpeed + ' ft/sec';
	}
}

class JumperMixin {
	protected jumpHeight: number = 3;

	public jump(){
		return 'They are jumping ' + this.jumpHeight + ' ft in the air';
	}
}

class LongJumper extends Mixin(Person, RunnerMixin, JumperMixin) {
	protected stateDistance() {
		return 'They landed ' + this.runSpeed * this.jumpHeight + ' ft from the start!';
	}

	public longJump() {
		let msg = "";
		msg += this.run() + '\n';
		msg += this.jump() + '\n';
		msg += this.stateDistance() + '\n';

		return msg;
	}
}
```

### Dealing with Static Properties
Consider the following scenario:
```typescript
class Person {
	public static TOTAL: number = 0;
	constructor() {
		(<typeof Person>this.constructor).TOTAL ++;
	}
}

class StudentMixin {
	public study() { console.log('I am studying so hard') }
}

class CollegeStudent extends Mixin(Person, StudentMixin) {}
```

It would be expected that class `CollegeStudent` should have the property `TOTAL` since
`CollegeStudent` inherits from `Person`.  The `Mixin` function properly sets up the
inheritance of this static property, so that modifying it on the `CollegeStudent` class
will also affect the `Person` class:

```typescript
let p1 = new Person();
let cs1 = new CollegeStudent();

// Person.TOTAL === CollegeStudent.TOTAL === 2
```

The only issue is that due to the impossibility of specifying properties on a constructor
type, you must use some type assertions to keep the TypeScript compiler from complaining:

```typescript
CollegeStudent.TOTAL ++;                           // error
(<any>CollegeStudent).TOTAL ++;                    // ok
(<typeof Person><unknown>CollegeStudent).TOTAL++;  // ugly, but better
```

### Dealing with Generics
Normally, the `Mixin` function is able to figure out the class types and produce an
appropriately typed result.  However, when generics are involved, you should pass in
type parameters to the `Mixin` function like so:
```typescript
class GenClassA<T> {}
class GenClassB<T> {}

class Mixed<T1, T2> extends Mixin<GenClassA<T1>, GenClassB<T2>>(GenClassA, GenClassB) {}
```

While this is a bit of an inconvenience, it only affects generic classes.

# Contributing
All contributions are welcome, just please run `npm run lint` and `npm run test` before
submitting a PR.

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [github.com/tannerntannern](https://github.com/tannerntannern)