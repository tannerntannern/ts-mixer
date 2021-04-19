import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';

const getConfig = ({output, isMinified}) => {
	return {
		input: 'src/index.ts',
		output: {
			file: output,
			format: 'esm'
		},
		plugins: [
			typescript({
				module: 'esnext'
			}),
			...(isMinified ? [terser()] : [])
		]
	};
};

export default [
	getConfig({output: 'dist/esm/index.js'}),
	getConfig({output: 'dist/esm/index.min.js', isMinified: true})
];
