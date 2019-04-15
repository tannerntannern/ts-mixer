// TODO: will any of this work with generics???

type Class<CtorArgs extends Array<unknown>, InstanceType = {}, ProtoType = {}, StaticType = {}> =
	{prototype: ProtoType, new(...args: CtorArgs): InstanceType} & StaticType;

const makeMixinFromClass = <CtorArgs extends Array<unknown>, ClassInstance, ClassProto, ClassStatic>(clazz: Class<CtorArgs, ClassInstance, ClassProto, ClassStatic>) =>
	<BaseInstance, BaseProto, BaseStatic>(Base: Class<CtorArgs, BaseInstance, BaseProto, BaseStatic>) => {
		// @ts-ignore
		let Mixed = class extends Base {
			constructor(...args: CtorArgs) {
				super(...args);
				Object.assign(this, new clazz(...args));
			}
		};

		Object.assign(Mixed.prototype, clazz.prototype);

		// TODO: Inherit statics

		return Mixed as Class<CtorArgs, BaseInstance & ClassInstance, BaseProto & ClassProto, BaseStatic & ClassStatic>;
	};

class ClassA {
	static CLASS_A_CONST: number = 0;

	methodA(input: number) {};
}

let MixinA = makeMixinFromClass(ClassA);

let MixedClass = MixinA(class MyClass { myMethod(input: string){} });

let m = new MixedClass();
