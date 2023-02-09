import { Class } from './types';
import { flatten, protoChain, unique } from './util';
import { getMixinsForClass } from './mixin-tracking';

type ObjectOfDecorators<T extends PropertyDecorator | MethodDecorator> = { [key: string]: T[] };

export type PropertyAndMethodDecorators = {
	property?: ObjectOfDecorators<PropertyDecorator>,
	method?: ObjectOfDecorators<MethodDecorator>,
};

type Decorators = {
	class?: ClassDecorator[],
	static?: PropertyAndMethodDecorators,
	instance?: PropertyAndMethodDecorators,
};

const mergeObjectsOfDecorators = <T extends PropertyDecorator | MethodDecorator>(
	o1: ObjectOfDecorators<T>,
	o2: ObjectOfDecorators<T>,
): ObjectOfDecorators<T> => {
	const allKeys = unique([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]);
	const mergedObject: ObjectOfDecorators<T> = {};
	for (let key of allKeys)
		mergedObject[key] = unique([...(o1?.[key] ?? []), ...(o2?.[key] ?? [])]);
	return mergedObject;
};

const mergePropertyAndMethodDecorators = (d1: PropertyAndMethodDecorators, d2: PropertyAndMethodDecorators): PropertyAndMethodDecorators => ({
	property: mergeObjectsOfDecorators(d1?.property ?? {}, d2?.property ?? {}),
	method: mergeObjectsOfDecorators(d1?.method ?? {}, d2?.method ?? {}),
});

const mergeDecorators = (d1: Decorators, d2: Decorators): Decorators => ({
	class: unique([...d1?.class ?? [], ...d2?.class ?? []]),
	static: mergePropertyAndMethodDecorators(d1?.static ?? {}, d2?.static ?? {}),
	instance: mergePropertyAndMethodDecorators(d1?.instance ?? {}, d2?.instance ?? {}),
});

const decorators: Map<Class, Decorators> = new Map();

const findAllConstituentClasses = (...classes: Class[]): Class[] => {
	const allClasses = new Set<Class>();
	const frontier = new Set<Class>([...classes]);

	while (frontier.size > 0) {
		for (let clazz of frontier) {
			const protoChainClasses = protoChain(clazz.prototype).map(proto => proto.constructor);
			const mixinClasses = getMixinsForClass(clazz) ?? [];
			const potentiallyNewClasses = [...protoChainClasses, ...mixinClasses] as Class[];
			const newClasses = potentiallyNewClasses.filter(c => !allClasses.has(c));
			for (let newClass of newClasses)
				frontier.add(newClass);

			allClasses.add(clazz);
			frontier.delete(clazz);
		}
	}

	return [...allClasses];
};

export const deepDecoratorSearch = (...classes: Class[]): Decorators => {
	const decoratorsForClassChain =
		findAllConstituentClasses(...classes)
			.map(clazz => decorators.get(clazz as Class))
			.filter(decorators => !!decorators) as Decorators[];

	if (decoratorsForClassChain.length == 0)
		return {};

	if (decoratorsForClassChain.length == 1)
		return decoratorsForClassChain[0];

	return decoratorsForClassChain.reduce((d1, d2) => mergeDecorators(d1, d2));
};

export const directDecoratorSearch = (...classes: Class[]): Decorators => {
	const classDecorators = classes.map(clazz => getDecoratorsForClass(clazz));

	if (classDecorators.length === 0)
		return {};

	if (classDecorators.length === 1)
		return classDecorators[0];

	return classDecorators.reduce((d1, d2) => mergeDecorators(d1, d2));
};

export const getDecoratorsForClass = (clazz: Class) => {
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

		const decoratorsForTargetType = decoratorsForClass?.[decoratorTargetType] ?? {};
		decoratorsForClass[decoratorTargetType] = decoratorsForTargetType;

		let decoratorsForType = decoratorsForTargetType?.[decoratorType] ?? {};
		decoratorsForTargetType[decoratorType] = decoratorsForType as any;

		let decoratorsForKey = decoratorsForType?.[key] ?? [];
		decoratorsForType[key] = decoratorsForKey;

		// @ts-ignore: array is type `A[] | B[]` and item is type `A | B`, so technically a type error, but it's fine
		decoratorsForKey.push(decorator);

		// @ts-ignore
		return decorator(object, key, ...otherArgs);
	}) as T;

export const decorate = <T extends ClassDecorator | PropertyDecorator | MethodDecorator>(decorator: T): T =>
	((...args: any[]) => {
		if (args.length === 1)
			return decorateClass(decorator as ClassDecorator)(args[0]);

		return decorateMember(decorator as PropertyDecorator | MethodDecorator)(...args as [Object, string, TypedPropertyDescriptor<any>]);
	}) as T;
