define('a', ['./foo', './bar'], function(foo, bar){

  'use strict';

  var baz = require('baz');
  var qux = require('qux');

  console.log('some line of code');

  return {
    height: foo.height,
    width: bar.width
  };

});
