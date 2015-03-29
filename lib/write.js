var through = require('through');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

module.exports = function(destDir, fileName){
  
  var data = '';

  return through(write, end);

  function write(buf) {
    data += buf;
  }

  function end() {
    var self = this;
    mkdirp(destDir, function(error){
      if (error) throw error;
      fs.writeFile(path.join(destDir, fileName), data, function(error){
        if (error) throw error;
        self.queue(null);
      });
    });
  }

};
