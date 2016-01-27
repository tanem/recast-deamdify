# recast-deamdify

[![build status](https://img.shields.io/travis/tanem/recast-deamdify/master.svg?style=flat-square)](https://travis-ci.org/tanem/recast-deamdify)
[![npm version](https://img.shields.io/npm/v/recast-deamdify.svg?style=flat-square)](https://www.npmjs.com/package/recast-deamdify)
[![npm downloads](https://img.shields.io/npm/dm/recast-deamdify.svg?style=flat-square)](https://www.npmjs.com/package/recast-deamdify)

Transform AMD modules to CommonJS using [recast](https://github.com/benjamn/recast).

```
Usage: recast-deamdify [source dir] {OPTIONS}

Options:
  --output, -o  Write the trasformed files to this dir.
                This option is required if a source dir is specified.
                If unspecified and a single source file is being transformed,
                recast-deamdify will print to stdout.

Examples:
  cat foo.js | recast-deamdify > bar.js
  recast-deamdify src/ -o dest/
```

## Motivation

Retaining the correct format in the transformed code was important for my use case. Other modules exist but didn't quite fit the bill (e.g. [require2commonjs](https://github.com/villadora/require2commonjs)).

Initial versions of this module used [esprima](https://github.com/jquery/esprima) then [acorn](https://github.com/marijnh/acorn) plus their associated code generators, but I couldn't get the results I wanted. Hence, recast.

## Installation

```
$ npm install -g recast-deamdify
```

## Examples

### Single file

Given `a.js`:

```js
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
```

This:

```
$ cat test/fixtures/a.js | recast-deamdify > foo.js
```

Or this:

```js
var recastDeamdify = require('recast-deamdify');
var fs = require('fs');

fs.createReadStream('./test/fixtures/a.js')
  .pipe(recastDeamdify())
  .pipe(fs.createWriteStream('foo.js'));
```

Will produce `foo.js`:

```js
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
```

### Multiple files

Let's say we want to transform all `.js` files contained in `src` and write them to `dest`, whilst maintaining `src`'s directory structure:

```
$ recast-deamdify src -o dest
```

Or you can use the API:

```js
var recastDeamdify = require('recast-deamdify');

recastDeamdify({
  srcDir: 'src',
  destDir: 'dest'
}, function(){
  console.log('complete!');
});
```

## Tests

```
$ npm test
```

## License

MIT
