const fs = require('fs');
const fs_extra = require('fs-extra');
const prettier = require('prettier');
const inquirer = require('inquirer');
const { version } = require('../package.json');

const args = process.argv.slice(2);

let dirname = 'icons';

args.forEach((item) => {
  if (item.includes('--dirname')) {
    dirname = item.split('=')[1];
  }
});

let generateFilesNum = 0;
let totalFiles = 0;

const question = [
  {
    type: 'confirm',
    message: 'If the directory already exists, determine whether to clear it and generate it again',
    name: 'isRemove',
  },
];

const getFileNameList = () => {
  let filesList = fs.readdirSync('./');
  if (filesList.length === 0) {
    throw new Error('The directory is empty!');
  }

  const fileNameList = filesList
    .map((item) => {
      if (item.includes('.svg')) {
        return {
          name: item
            .substring(0, item.length - 4)
            .toLocaleLowerCase()
            .split('-')
            .map((item) => item[0].toLocaleUpperCase() + item.substring(1))
            .join(''),
          originName: item,
        };
      }
    })
    .filter((item) => item);

  if (fileNameList.length === 0) {
    throw new Error('This folder does not have any svg files!');
  }

  totalFiles = fileNameList.length;
  return fileNameList;
};

const generateReactComponent = (fileSource, filename) => {
  let svgSource = '<svg' + fileSource.split('<svg')[1];
  if (svgSource.includes('fill')) {
    svgSource = svgSource.replace(/fill(\S*)\"/gi, 'fill="currentColor"');
  }

  let template = `
  import React from "react";

  const svg = '${svgSource}';

  const ${filename}${!args.includes('--type=js') ? ': React.FC<any>' : ''} = (props) => <div {...props} dangerouslySetInnerHTML={{ __html: svg }}></div>;
  
  export default ${filename};
  `;

  const code = prettier.format(template, { singleQuote: true, parser: 'typescript' });

  fs.writeFileSync(`./${dirname}/${filename}.${args.includes('--type=js') ? 'jsx' : 'tsx'}`, code);
  generateFilesNum++;
  console.log(`Generating... (${generateFilesNum}/${totalFiles})`);
};

const isExistsDir = () => {
  return fs.existsSync(dirname);
};

const generateEntry = (fileNameList) => {
  let indexSource = fileNameList.map(({ name }) => `export { default as ${name} } from './${name}';`).join('\n');
  const indexCode = prettier.format(indexSource, { singleQuote: true, parser: 'typescript' });
  fs.writeFileSync(`./${dirname}/index.${!args.includes('--type=js') ? 'ts' : 'js'}`, indexCode);
  if (generateFilesNum === totalFiles) {
    console.log('Components generation succeeded!');
    generateFilesNum = 0;
    totalFiles = 0;
  }
};

const outputFileToFolder = (fileNameList) => {
  fs_extra.emptyDirSync(dirname);
  fileNameList.forEach(({ originName, name }) => {
    let code = fs.readFileSync(`./${originName}`, { encoding: 'utf-8' });
    generateReactComponent(code, name);
  });
  generateEntry(fileNameList);
};

const run = () => {
  if (args.includes('--version')) {
    console.log(version);
    return;
  }
  try {
    const fileNameList = getFileNameList();
    if (isExistsDir()) {
      inquirer.prompt(question).then(({ isRemove }) => {
        if (isRemove) {
          outputFileToFolder(fileNameList);
        }
      });
    } else {
      outputFileToFolder(fileNameList);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getFileNameList,
  generateReactComponent,
  generateEntry,
  outputFileToFolder,
  run,
};
