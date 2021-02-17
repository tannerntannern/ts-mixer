const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { resolve } = require('path');
const { load } = require('js-yaml');

const main = () => {
	const ciYaml = loadYaml(resolve(__dirname, '.github/workflows/CI.yml'))
	const tsVersions = ciYaml.jobs.test.strategy.matrix['typescript-version'].map(version => version.replace('.x', '')).join(',');
	const nodeVersions = ciYaml.jobs.test.strategy.matrix['node-version'].map(version => version.replace('.x', '')).join('%2C');

	replaceInFileInline(
		resolve(__dirname, 'README.md'),
		'[ts-versions]: ',
		`https://badgen.net/badge/icon/${tsVersions}?icon=typescript&label&list=|`,
	);
	replaceInFileInline(
		resolve(__dirname, 'README.md'),
		'[node-versions]: ',
		`https://badgen.net/badge/node/${nodeVersions}/blue/?list=|`,
	);
	replaceInFileInline(
		resolve(__dirname, 'LICENSE'),
		'Copyright (c) ',
		`${new Date().getFullYear()} Tanner Nielsen`,
	)

	if (process.argv.includes('--check')) {
		const gitStatus = execSync('git status --short').toString('utf-8').trim();
		if (gitStatus !== '') {
			console.error('Diffs were found (please run "yarn codegen" locally and commit changes):');
			console.log(gitStatus);
			process.exit(1);
		}
	}
};

// ----------------[ UTIL ]-------------------

const loadYaml = (filename) => load(readFileSync(filename, 'utf8'));

const replaceInFile = (filename, tag, replaceContent) => {
	const [fileLines, replaceLines] =
		[readFileSync(filename, 'utf8'), replaceContent]
		.map(text => text.split('\n'));

	const [startIndex, endIndex] =
		[`codegen:start(${tag})`, `codegen:end(${tag})`]
		.map(searchContent => fileLines.findIndex(line => line.includes(searchContent)));

	if (startIndex < 0 || endIndex < 0)
		throw new Error('Cannot find tags in file');

	fileLines.splice(startIndex + 1, endIndex - startIndex - 1, ...replaceLines);

	writeFileSync(filename, fileLines.join('\n'));
};

const replaceInFileInline = (filename, lineBeginning, replaceContent) => {
	if (replaceContent.includes('\n'))
		throw new Error('Cannot replace with multiple lines.  See replaceInFile() instead');

	const fileLines = readFileSync(filename, 'utf8').split('\n');
	const lineIndex = fileLines.findIndex(line => line.startsWith(lineBeginning));

	if (lineIndex < 0)
		throw new Error(`Cannot find "${lineBeginning}" text in file`);

	fileLines[lineIndex] = lineBeginning + replaceContent;

	writeFileSync(filename, fileLines.join('\n'));
};

main();
