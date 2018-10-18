# ts-mixer

**WARNING: WORK IN PROGRESS**

It seems that no one has been able to provide an acceptable way to gracefully implement
the mixin pattern with TypeScript.  The "mixins" as described by the
[TypeScript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) are horrendous.
Countless online threads feature half-working snippets.  Some are elegant, but fail to work
properly with static properties.  Others solve static properties, but they don't work well
with generics.  Some are memory-optimized, but force you to write the mixins in an awkward
and cumbersome format.

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
* Proper typing of the mixed class constructor[³](#caveats)

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
3. Unlike some mixin implementations, ts-mixer assigns a constructor signature to the
mixed class.  Because the mixing classes need to have compatible constructor signatures,
the first class passed to the `Mixin` function is used as the model for the signature.

# Getting Started
## Installation
...

## Examples
### Basic Example
...

### Dealing with Static Properties
...

### Dealing with Generics
...

# Contributing
All contributions are welcome, just please run `npm run lint` and `npm run test` before
submitting a PR.

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [github.com/tannerntannern](https://github.com/tannerntannern)