var test = require('tape');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var os = require('os');
var rimraf = require('rimraf');
var through = require('through');
var recastDeamdify = require('..');

var fixturesDir = path.join(__dirname, 'fixtures');
var expectedDir = path.join(__dirname, 'expected');

// The tests are written so that we can just add fixture and expected files
// without having to touch these tests.

// Transform each fixture file and test it against the relevant expected file.
glob('**/*.js', { cwd: fixturesDir }, function(error, fixturePaths){
  if (error) throw error;
  fixturePaths.forEach(function(fixturePath){
    test('should correctly transform a single file -> ' + fixturePath, function(t){
      t.plan(1);
      var data = '';
      fs.createReadStream(path.join(fixturesDir, fixturePath))
        .pipe(recastDeamdify())
        .pipe(through(
          function write(buf) {
            data += buf;
          },
          function end() {
            t.equal(
              data,
              fs.readFileSync(path.join(expectedDir, fixturePath), { encoding: 'utf-8' })
            );
          }
        ));
    });
  });
});

// Transform the fixture files all at once, and compare them against the expected files.
test('should correctly transform multiple files', function(t){

  var destDir = path.join(os.tmpdir(), 'recast-deamdify');

  recastDeamdify({
    srcDir: fixturesDir,
    destDir: destDir
  }, function(){
    glob('**/*.js', { cwd: destDir }, function(error, files){
      if (error) t.fail(error);
      t.plan(files.length);
      files.forEach(function(file){
        t.equal(
          fs.readFileSync(path.join(expectedDir, file), { encoding: 'utf-8' }),
          fs.readFileSync(path.join(destDir, file), { encoding: 'utf-8' })
        );
      });
      rimraf(destDir, function(error){
        if (error) t.fail(error);
      });
    });
  });

});
