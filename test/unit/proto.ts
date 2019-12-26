import 'mocha';
import { expect } from 'chai';

import { getProtoChain, nearestCommonAncestor } from '../../src/proto';

describe('getProtoChain', () => {
	it('should return an empty list for Object.prototype', () => {
		expect(getProtoChain(Object.prototype)).to.deep.equal([]);
	});

	it('should return [Object.prototype] for direct instances of Object', () => {
		expect(getProtoChain({})).to.deep.equal([Object.prototype]);
	});

	it('should return the proper chain for a 1-layer deep class', () => {
		class Foo {}

		expect(getProtoChain(new Foo())).to.deep.equal([Foo.prototype, Object.prototype]);
	});

	it('should return the proper chain for an N-layer deep class', () => {
		class Foo {}
		class Bar extends Foo {}
		class Baz extends Bar {}

		expect(getProtoChain(new Baz())).to.deep.equal([Baz.prototype, Bar.prototype, Foo.prototype, Object.prototype]);
	});
});

describe('nearestCommonAncestor', () => {
	it('should return undefined when no objects are passed', () => {
		expect(nearestCommonAncestor()).to.equal(undefined);
	});
	
	it('should return undefined when objects share no common lineage (not even Object)', () => {
		const a = Object.create(null);
		const b = {};

		expect(nearestCommonAncestor(a, b)).to.equal(undefined);
	});

	it('should return Object for two instances of unrelated classes', () => {
		class A {}
		class B {}

		expect(nearestCommonAncestor(new A(), new B())).to.equal(Object);
	});

	it('should properly identify the common ancestor 1 layer deep', () => {
		class Common {}
		class A extends Common {}
		class B extends Common {}

		expect(nearestCommonAncestor(new A(), new B())).to.equal(Common);
	});

	it('should properly identify the common ancestor N layers deep', () => {
		class Common {}
		class A extends Common {}
		class AA extends A {}
		class AAA extends AA {}
		class B extends Common {}
		class BB extends B {}
		class BBB extends BB {}

		expect(nearestCommonAncestor(new AAA(), new BBB())).to.equal(Common);
	});

	it('should identify the common ancestor when two objects share a near ancestor, but the third does not', () => {
		class ActualCommon {}
		class A extends ActualCommon {}
		class AlmostCommon extends ActualCommon {}
		class B extends AlmostCommon {}
		class C extends AlmostCommon {}

		expect(nearestCommonAncestor(new A(), new B(), new C())).to.equal(ActualCommon);
	});
});
