export type Settings = {
	staticsStrategy: 'copy' | 'proxy',
	prototypeStrategy: 'copy' | 'proxy',
};

export const DefaultSettings: Settings = {
	staticsStrategy: 'copy',
	prototypeStrategy: 'copy',
};
