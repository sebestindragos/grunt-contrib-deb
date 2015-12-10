var tar = require('tar-stream');
var fs = require('fs');
var path = require('path');
var async = require('async');

/**
 * Class used for creating .deb packages
 */
function Deb(cwd) {
  this.cwd = cwd;
}

/**
 * Add files to the .deb package.
 * 
 * @param files - an object with the following format {'path/to/source/dir': 'path/to/target/dir'} (e.g. {'../../src/lib': '/srv/productName/lib'})
 */
Deb.prototype.packFiles = function (files) {
  var self = this;
  
  self.data = tar.pack();
  async.forEachOf(files, function (destPath, srcPath, done) {
    addFilesToTarball.call(self, self.data, srcPath, './', '.' + destPath, done);
  }, function (err) {
    if (err)
      return console.error('there was a problem adding files to the .deb package: ', err);

    console.log('successfully added files to .deb package');
    self.data.pipe(fs.createWriteStream(path.join(self.cwd, 'data.tar')));
  });  
};

/**
 * Recursively add a directory's contents to the tarball.
 */
function addFilesToTarball(tarball, srcPath, subdir, destPath, callback) {
  var self = this;
  
  var crtSrcPath = path.join(self.cwd, srcPath, subdir);
  
  // enum files in the folder
  fs.readdir(crtSrcPath, function (err, files) {
    if (err)
      return callback(err);
      
    async.eachSeries(files, function (crtFile, done) {
      var filePath = path.join(crtSrcPath, crtFile);
      fs.stat(filePath, function (err, stats) {
        if (err)
          return done(err);
          
        if (stats.isDirectory()) {
          // recursively add the contents of this subdir
          addFilesToTarball.call(self, tarball, srcPath, path.join(subdir, crtFile), 
            path.join(destPath, crtFile), done);
        } else {
          // this is a file, add it to the tarball
          fs.readFile(filePath, function (err, data) {
            if (err)
              return done(err);
              
            tarball.entry({name: path.join(destPath, crtFile)}, data);
            done();
          });          
        }
      });
    }, callback);
  });
}

module.exports = function (cwd) {
  return new Deb(cwd);
};
