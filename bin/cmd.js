#!/usr/bin/env node

var fs = require('fs');
var recastDeamdify = require('../');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

if (argv.h || argv.help) {
  return showUsage();
}

var srcDir = argv._.toString();
var destDir = argv.o;

if (!srcDir.length && !destDir) {
  return process.stdin.pipe(recastDeamdify()).pipe(process.stdout);
}

if (srcDir.length && destDir) {
  return recastDeamdify({
    srcDir: srcDir,
    destDir: destDir
  });
}

showUsage();

function showUsage() {
  fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}
