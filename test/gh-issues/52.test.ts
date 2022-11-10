import 'mocha';
import { expect } from 'chai';
import { forEachSettings } from '../util';

import { decorate, Mixin } from '../../src';

describe('gh-issue #52', () => {
	forEachSettings(() => {
		it('should support class decorators that do not return anything', async () => {
            const nonReturningClassDecorator = (target: Function) => {
                expect(target).is.not.undefined;
            };
            
            expect(() => {
                @decorate(nonReturningClassDecorator)
                @decorate(nonReturningClassDecorator)
                class Foo {}
                class Bar{}

                const FooBar = Mixin(Foo, Bar);
                new FooBar();
            }).not.to.throw();
        })
    })
});
