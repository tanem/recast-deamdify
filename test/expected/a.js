'use strict';

var foo = require('./foo');
var bar = require('./bar');
var baz = require('baz');
var qux = require('qux');

console.log('some line of code');

module.exports = {
  height: foo.height,
  width: bar.width
};
