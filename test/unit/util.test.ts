import 'mocha';
import { expect } from 'chai';

import { copyProps, protoChain, nearestCommonProto, unique, flatten } from '../../src/util';

describe('copyProps', () => {
	// TODO: ...
});

describe('protoChain', () => {
	it('should return [Object.prototype] for Object.prototype', () => {
		expect(protoChain(Object.prototype)).to.deep.equal([Object.prototype]);
	});

	it('should return [Object.prototype] for direct instances of Object', () => {
		let obj = {};
		expect(protoChain(obj)).to.deep.equal([obj, Object.prototype]);
	});

	it('should return the proper chain for a 1-layer deep class', () => {
		class Foo {}
		let foo = new Foo();
		expect(protoChain(foo)).to.deep.equal([foo, Foo.prototype, Object.prototype]);
	});

	it('should return the proper chain for an N-layer deep class', () => {
		class Foo {}
		class Bar extends Foo {}
		class Baz extends Bar {}
		let baz = new Baz();
		expect(protoChain(baz)).to.deep.equal([baz, Baz.prototype, Bar.prototype, Foo.prototype, Object.prototype]);
	});
});

describe('nearestCommonProto', () => {
	it('should return undefined when no objects are passed', () => {
		expect(nearestCommonProto()).to.equal(undefined);
	});

	it('should return undefined when objects share no common lineage (not even Object)', () => {
		const a = Object.create(null);
		const b = {};

		expect(nearestCommonProto(a, b)).to.equal(undefined);
	});

	it('should return Object for two instances of unrelated classes', () => {
		class A {}
		class B {}

		expect(nearestCommonProto(new A(), new B())).to.equal(Object.prototype);
	});

	it('should properly identify the common ancestor 1 layer deep', () => {
		class Common {}
		class A extends Common {}
		class B extends Common {}

		expect(nearestCommonProto(new A(), new B())).to.equal(Common.prototype);
	});

	it('should properly identify the common ancestor N layers deep', () => {
		class Common {}
		class A extends Common {}
		class AA extends A {}
		class AAA extends AA {}
		class B extends Common {}
		class BB extends B {}
		class BBB extends BB {}

		expect(nearestCommonProto(new AAA(), new BBB())).to.equal(Common.prototype);
	});

	it('should identify the common ancestor when two objects share a near ancestor, but the third does not', () => {
		class ActualCommon {}
		class A extends ActualCommon {}
		class AlmostCommon extends ActualCommon {}
		class B extends AlmostCommon {}
		class C extends AlmostCommon {}

		expect(nearestCommonProto(new A(), new B(), new C())).to.equal(ActualCommon.prototype);
	});

	it('should identify the common ancestor when one object\'s hierarchy is deeper than the other\'s', () => {
		class Common1 {}
		class Common2 extends Common1 {}
		class A extends Common2 {}
		class B extends Common2 {}
		class C extends B {}
		class D extends C {}

		expect(nearestCommonProto(new A(), new D())).to.equal(Common2.prototype);
	});
});

describe('hardMixProtos', () => {
	// TODO: ...
});

describe('sofMixProtos', () => {
	// TODO: ...
});

describe('unique', () => {
	it('should leave already-dupe-free arrays alone', () => {
		expect(unique([1, 2, 3])).to.deep.equal([1, 2, 3]);
	});

	it('should filter duplicates', () => {
		expect(unique(['a', 'b', 'c', 'c', 'd'])).to.deep.equal(['a', 'b', 'c', 'd']);
	});
});

describe('flatten', () => {
	it('should passthrough an empty array', () => {
		expect(flatten([])).to.deep.equal([]);
	});

	it('should work with single nested array', () => {
		expect(flatten([['a', 'b', 'c']])).to.deep.equal(['a', 'b', 'c']);
	});

	it('should work with multiple nested arrays', () => {
		expect(flatten([[1, 2, 3], [4, 5, 6]])).to.deep.equal([1, 2, 3, 4, 5, 6]);
	});
});
