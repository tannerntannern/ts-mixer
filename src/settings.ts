export type Settings = {
	initFunction: string | null,
	staticsStrategy: 'copy' | 'proxy',
	prototypeStrategy: 'copy' | 'proxy',
	decoratorInheritance: 'deep' | 'direct' | 'none',
};

export const settings: Settings = {
	initFunction: 'init',
	staticsStrategy: 'copy',
	prototypeStrategy: 'copy',
	decoratorInheritance: 'deep',
};
