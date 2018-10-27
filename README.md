# ts-mixer
[![Build Status](https://travis-ci.org/tannerntannern/ts-mixer.svg?branch=master)](https://travis-ci.org/tannerntannern/ts-mixer)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/ts-mixer/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/ts-mixer?branch=master)
[![dependencies Status](https://david-dm.org/tannerntannern/ts-mixer/status.svg)](https://david-dm.org/tannerntannern/ts-mixer)

### Why another Mixin library? 
It seems that no one has been able to provide an acceptable way to gracefully implement
the mixin pattern with TypeScript.  Mixins as described by the
[TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are far less
than ideal.  Countless online threads feature half-working snippets.  Some are elegant,
but fail to work properly with static properties.  Others solve static properties, but
they don't work well with generics.  Some are memory-optimized, but force you to write the
mixins in an awkward, cumbersome format.

My fruitless search has led me to believe that there is no perfect solution with the
current state of TypeScript.  Instead, I present a "tolerable" solution that attempts to
take the best from the many different implementations while mitigating their flaws as much
as possible.

## Features
* Support for mixing plain TypeScript classes
* Support for mixing classes that extend other classes
* Support for protected and private properties
* **Support for classes with generics** (woot!)[¹](#caveats)
* Automatic inference of the mixed class type[¹](#caveats)
* Proper handling of static properties[²](#caveats)

#### Caveats
1. Some mixin implementations require you to do something like `Mixin<A & B>(A, B)` in
order for the types to work correctly.  ts-mixer is able to infer these types, so you can
just do `Mixin(A, B)`, except when generics are involved.  See
[Dealing with Generics](#dealing-with-generics).
2. Due to the way constructor types work in TypeScript, it's impossible to specify a type
that is both a constructor and has specific properties.  Static properties are still
accessible "on the JavaScript side," but you have to make some type assertions to convince
TypeScript that you can access them.  See
[Dealing with Static Properties](#dealing-with-static-properties).

## Non-features
* `instanceof` support;  Because this library is intended for use with TypeScript, running
an `instanceof` check is generally not needed.  Additionally, adding support can have
[negative effects on performance](https://stackoverflow.com/a/1919670).  See the
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
for more information.

# Getting Started
## Installation
`npm i --save ts-mixer`

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
import {Mixin} from 'ts-mixer';

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

Person.TOTAL === 2; 		// true
CollegeStudent.TOTAL === 2;	// true
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
appropriately typed result.  However, when generics are involved, the `Mixin` function
is not able to correctly infer the type parameters.  Consider the following:

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
class Mixed extends Mixin(GenClassA, GenClassB) {}
```

But we run into trouble here because we can't pass our type parameters along with the
arguments to the `Mixin` function.  How can we resolve this?

### Option 1: Passing Type Parameters
One solution is to pass your type information as type parameters to the `Mixin` function
(note that the `string` and `number` types are arbitrary):

```typescript
class Mixed extends Mixin<GenClassA<string>, GenClassB<number>>(GenClassA, GenClassB) {}
```

This really works quite well.  However, it gets worse if you need the mixins to reference
type parameters on the class, because this won't work:

```typescript
class Mixed<A, B> extends Mixin<GenClassA<A>, GenClassB<B>>(GenClassA, GenClassB) {}
// Error: TS2562: Base class expressions cannot reference class type parameters.
```

### Option 2: Wrapping the Class in a Function
To allow for the generic mixins to have access to the generic class's type parameters, the
type parameters have to be available in the same scope.  To accomplish this, the simplest
way is to wrap the class in a function, and use that function in place of the class.  It's
not the best solution, but it gets the job done: 

```typescript
function Mixed<A, B>() {
	return class Mixed extends Mixin<GenClassA<A>, GenClassA<B>>(GenClassA, GenClassB) {
		someAdditionalMethod(input1: A, input2: B) {}
	}
}

let m = new (Mixed<string, number>())();
```

### Option 3: Using Class Decorators and Interface Merging
Another (perhaps more preferable) way to solve the above issue makes simultaneous use of
class decorators and interface merging to create the proper class typing.  It has the benefit
of working without wrapping the class in a function, but because it depends on class
decorators, the solution may not last for future versions of TypeScript. (I tested on 3.1.3)

Either way, it's a super cool solution.  Consider the following:

```typescript
import {MixinDecorator} from 'ts-mixer';

@MixinDecorator(GenClassA, GenClassB)
class Mixed<A, B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
```

The first thing to note is the `MixinDecorator` import.  This function is very similar to
the `Mixin` function, but in a [decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)
format.  Decorators have the annoying property that even though they may modify the shape
of the class they decorate "on the JavaScript side," the types don't update "on the 
TypeScript side."  So as far as the TypeScript compiler is concerned in the example above,
class `Mixed` just has that one method, even though the decorator is really adding methods
from the mixed generic classes.

How do we convince TypeScript that `Mixed` has the additional methods?  An attempt at a
solution might look like this:

```typescript
@MixinDecorator(GenClassA, GenClassB)
class Mixed<A, B> implements GenClassA<A>, GenClassB<B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
```

But now TypeScript will complain that `Mixed` doesn't implement `GenClassA` and `GenClassB`
correctly, because it can't see the changes made by the decorator.  Instead, we can use
[interface merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces):

```typescript
@MixinDecorator(GenClassA, GenClassB)
class Mixed<A, B> {
	someAdditonalMethod(input1: A, input2: B) {}
}
interface Mixed<A, B> extends GenClassA<A>, GenClassB<B> {}
```

TADA! We now have a truly generic class that uses generic mixins!

It's worth noting however that it's _only_ through the combination of TypeScript's failure
to consider type modifications with decorators in conjunction with interface merging that
this works.  If we attempted interface merging without the decorator, we would run into
trouble:

```typescript
interface Mixed<A, B> extends GenClassA<A>, GenClassB<B> {}
class Mixed<A, B> extends Mixin(GenClassA, GenClassB) {
	newMethod(a: A, b: B) {}
}

// Error:TS2320: Interface 'Mixed<A, B>' cannot simultaneously extend types 'GenClassA<{}> & GenClassB<{}>' and 'GenClassA<A>'.
// Named property 'methodA' of types 'GenClassA<{}> & GenClassB<{}>' and 'GenClassA<A>' are not identical.
```

We get this error because when the `Mixin` function is used in an extends clause, TypeScript
is smart enough extract type information, which conflicts with the interface definition
above it; when `Mixin` is given the generic classes as arguments, it doesn't receive their
type parameters and they default to `{}`.  Even if you try to `// @ts-ignore` ignore it,
the type checker will prefer the types of the `Mixin` function over those of the interface.

# Contributing
All contributions are welcome, just please run `npm run lint` and `npm run test` before
submitting a PR.  If you add a new feature, please make sure it's covered by a test case.

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [github.com/tannerntannern](https://github.com/tannerntannern)