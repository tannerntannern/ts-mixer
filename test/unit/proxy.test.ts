import 'mocha';
import { expect } from 'chai';
import { getIngredientWithProp, proxyMix } from '../../src/proxy';

describe('getIngredientWithProp()', () => {
	const foo = { isFoo: true };
	const bar = { isBar: true };
	const ingredients = [foo, bar];

	it('should properly identify the ingredient with the given prop', () => {
		expect(getIngredientWithProp('isFoo', ingredients)).to.equal(foo);
		expect(getIngredientWithProp('isBar', ingredients)).to.equal(bar);
	});

	it('should return undefined when no ingredients contain the given prop', () => {
		expect(getIngredientWithProp('doesntExist', ingredients)).to.equal(undefined);
	});

	it('should priperly identify the ingredient even when the given prop is not directly owned by a source', () => {
		const baz = Object.create({ isBaz: true });
		expect(getIngredientWithProp('isBaz', [...ingredients, baz])).to.equal(baz);
	});
});

describe('proxyMix', () => {
	let pm, pmProto, foo, bar;
	beforeEach(() => {
		pmProto = { isPmProto: true };
		foo = { isFoo: true };
		bar = { isBar: true };

		pm = proxyMix([foo, bar], pmProto);
	});

	it('should properly report the prototype', () => {
		expect(Object.getPrototypeOf(pm)).to.equal(pmProto);
	});

	it('should throw an error when attempting to set the prototype', () => {
		expect(() => Object.setPrototypeOf(pm, null)).to.throw;
	});

	it('should return the union of the ingredients\' properties on getOwnPropertyDescriptors()', () => {
		expect(Object.keys(Object.getOwnPropertyDescriptors(pm))).members(['isFoo', 'isBar']);
	});

	it('should throw an error when attempting to define a new property', () => {
		expect(() => Object.defineProperty(pm, 'newProp', {})).to.throw;
	});

	describe('using the `in` operator', () => {
		it('should "have" the sources\' keys', () => {
			expect('isFoo' in pm).to.be.true;
			expect('isBar' in pm).to.be.true;
		});

		it('should also "have" properties of the prototype', () => {
			expect('isPmProto' in pm).to.be.true;
		});
	});

	describe('getting values by key', () => {
		it('should be able to get the source values by key', () => {
			expect(pm.isFoo).to.be.true;
			expect(pm.isBar).to.be.true;
		});

		it('should also be able to get values from the prototype', () => {
			expect(pm.isPmProto).to.be.true;
		});
	});

	it('should throw an error when attempting to set a property', () => {
		expect(() => { pm.isFoo = false }).to.throw;
	});

	it('should throw an error when attempting to delete a property', () => {
		expect(() => { delete pm.isFoo }).to.throw;
	});

	it('should return the union of the ingredients\' keys on ownKeys()', () => {
		expect(Object.getOwnPropertyNames(pm)).members(['isFoo', 'isBar']);
	});
});
