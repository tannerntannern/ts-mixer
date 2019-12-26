import 'mocha';
import { expect } from 'chai';

import { getProtoChain } from '../../src/proto';

describe('getProtoChain()', () => {
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
