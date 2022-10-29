const glob = require('glob-all');
const { getFileNameList, outputFileToFolder } = require('../src/index.js');

describe('Test build VueComponent', () => {
  it('The vue component is generated', (done) => {
    outputFileToFolder(getFileNameList());
    const files = glob.sync(['./icons/*.vue']);
    if (files.length > 0) {
      done();
    } else {
      throw new Error('Failed to generate the vue file!');
    }
  });

  it('The entry file is generated', (done) => {
    const files = glob.sync(['./icons/index.ts']);
    if (files.length > 0) {
      done();
    } else {
      throw new Error('Failed to generate the vue file!');
    }
  });
});
