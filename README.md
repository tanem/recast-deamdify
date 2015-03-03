# recast-deamdify

[![Build Status](https://travis-ci.org/tanem/recast-deamdify.png?branch=master)](https://travis-ci.org/tanem/recast-deamdify)
[![NPM version](https://badge.fury.io/js/recast-deamdify.svg)](http://badge.fury.io/js/recast-deamdify)

Transform AMD modules to CommonJS using [recast](https://github.com/benjamn/recast).

## Motivation

Retaining the correct format in the transformed code was important for my use case. Other modules exist but didn't quite fit the bill (e.g. [require2commonjs](https://github.com/villadora/require2commonjs)).

Initial versions of this module used [esprima](https://github.com/jquery/esprima) then [acorn](https://github.com/marijnh/acorn) plus their associated code generators, but I couldn't get the results I wanted. Hence, recast.

## Installation

```
$ npm install -g recast-deamdify
```

## Usage

```
$ cat test/fixtures/a.js | recast-deamdify > foo.js
```

## Tests

```
$ npm test
```
