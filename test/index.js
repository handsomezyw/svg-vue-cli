const path = require('path');
const Mocha = require('mocha');

process.chdir('./test');

const mocha = new Mocha();

mocha.addFile(path.resolve(__dirname, 'build-vue-component.test.js'));

mocha.run();
