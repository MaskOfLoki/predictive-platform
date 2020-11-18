const shell = require('shelljs');
const path = require('path');

shell.rm(path.join('app', 'index.js'));
shell.rm('-rf', path.join('app', 'www'));
shell.cp('-r', 'www', 'app');
shell.cp('index.js', 'app');
