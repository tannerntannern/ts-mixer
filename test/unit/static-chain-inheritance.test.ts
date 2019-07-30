import 'mocha';
import { expect } from 'chai';
import { Mixin } from '../../src/mixins';

class TEST0 {
	static scope = 10;
}
class TEST1 extends TEST0 {}
class TEST2 extends Mixin(TEST1) {}

describe('Static chain inheritance', () => {
	it('should inherit static functions properly', () => {
		expect(TEST2.scope).to.equal(10);
	});
});
