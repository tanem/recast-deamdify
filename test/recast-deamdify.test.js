var test = require('tape');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var through = require('through');
var recastDeamdify = require('..');

glob(path.join(__dirname, 'fixtures/*.js'), function(error, fixtures){
  if (error) throw error;
  fixtures.forEach(function(fixture){
    var basename = path.basename(fixture);
    test('should correctly transform ' + basename, function(t){
      t.plan(1);
      var data = '';
      fs.createReadStream(fixture)
        .pipe(recastDeamdify())
        .pipe(through(
          function write(buf) {
            data += buf;
          },
          function end() {
            t.equal(
              data,
              fs.readFileSync(
                path.join(__dirname, 'expected', basename), { encoding: 'utf-8' }
              )
            );
          }
        ));
    });
  });
});
