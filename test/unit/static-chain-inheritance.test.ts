import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class TEST0 {
	static scope = 10;
}
const TEST1 = Mixin(TEST0, class {});
const TEST2 = Mixin(TEST1, class {});

describe('Static chain inheritance', () => {
	it('should inherit static properties correctly in an A extends B extends C scenario', () => {
		expect(TEST2.scope).to.equal(10);
	});
});
