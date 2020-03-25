import { Class } from './types';

export type PropertyAndMethodDecorators = {
	property?: { [key: string]: PropertyDecorator[] },
	method?: { [key: string]: MethodDecorator[] },
};

type Decorators = {
	class?: ClassDecorator[],
	static?: PropertyAndMethodDecorators,
	instance?: PropertyAndMethodDecorators,
};

export const decorators: Map<Class, Decorators> = new Map();

const getDecoratorsForClass = (clazz: Class) => {
	let decoratorsForClass = decorators.get(clazz);
	if (!decoratorsForClass) {
		decoratorsForClass = {};
		decorators.set(clazz, decoratorsForClass);
	}

	return decoratorsForClass;
};

const decorateClass = <T extends ClassDecorator>(decorator: T): T =>
	((clazz: Class) => {
		const decoratorsForClass = getDecoratorsForClass(clazz);

		let classDecorators = decoratorsForClass.class;
		if (!classDecorators) {
			classDecorators = [];
			decoratorsForClass.class = classDecorators;
		}

		classDecorators.push(decorator);

		return decorator(clazz);
	}) as T;

const decorateMember = <T extends PropertyDecorator | MethodDecorator>(decorator: T): T =>
	((object, key, ...otherArgs) => {
		const decoratorTargetType = typeof object === 'function' ? 'static' : 'instance';
		const decoratorType = typeof object[key] === 'function' ? 'method' : 'property';
		const clazz: Class = decoratorTargetType === 'static' ? object : object.constructor;

		const decoratorsForClass = getDecoratorsForClass(clazz);

		let decoratorsForTargetType = decoratorsForClass?.[decoratorTargetType];
		if (!decoratorsForTargetType) {
			decoratorsForTargetType = {};
			decoratorsForClass[decoratorTargetType] = decoratorsForTargetType;
		}

		let decoratorsForType = decoratorsForTargetType?.[decoratorType];
		if (!decoratorsForType) {
			decoratorsForType = {};
			decoratorsForTargetType[decoratorType] = decoratorsForType as any;
		}

		let decoratorsForKey = decoratorsForType?.[key];
		if (!decoratorsForKey) {
			decoratorsForKey = [];
			decoratorsForType[key] = decoratorsForKey;
		}

		decoratorsForKey.push(decorator);

		// @ts-ignore
		return decorator(object, key, ...otherArgs);
	}) as T;

export const decorate = <T extends ClassDecorator | PropertyDecorator | MethodDecorator>(decorator: T): T =>
	((...args: any[]) => {
		if (args.length === 1)
			return decorateClass(decorator as ClassDecorator)(args[0]);

		return decorateMember(decorator as PropertyDecorator | MethodDecorator)(...args as [Object, string, PropertyDescriptor?]);
	}) as T;
