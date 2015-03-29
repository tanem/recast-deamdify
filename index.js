var readdirp = require('readdirp');
var through = require('through');
var fs = require('fs');
var path = require('path');
var deamdify = require('./lib/deamdify');
var write = require('./lib/write');

module.exports = function(options, done){

  if (!options) {
    return deamdify();
  }

  options || (options = {});
  done || (done = function(){});

  var source = readdirp({
    root: options.srcDir,
    fileFilter: '*.js'
  });

  var counter = 0;

  source.pipe(through(function(entry){

    counter++;

    fs.createReadStream(entry.fullPath)
      .pipe(deamdify())
      .pipe(write(path.join(options.destDir, entry.parentDir), entry.name))
      .on('finish', function(){
        if (--counter) done();
      });

    this.queue(null);

  }));

};
