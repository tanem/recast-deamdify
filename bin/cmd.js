#!/usr/bin/env node

var recastDeamdify = require('../');

process.stdin.pipe(recastDeamdify()).pipe(process.stdout);