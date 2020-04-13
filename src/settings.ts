export type Settings = {
	initFunction: string | null,
	staticsStrategy: 'copy' | 'proxy',
	prototypeStrategy: 'copy' | 'proxy',
};

export const settings: Settings = {
	initFunction: null,
	staticsStrategy: 'copy',
	prototypeStrategy: 'copy',
};
