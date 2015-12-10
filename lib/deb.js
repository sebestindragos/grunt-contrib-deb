var tar = require('tar-stream');
var fs = require('fs');
var path = require('path');
var async = require('async');
var ar = require('ar-async');
var gunzip = require('gunzip-maybe');

/**
 * Class used for creating .deb packages
 */
function Deb() {
  this.control = tar.pack();
  this.data = tar.pack();
  this.dirs = {};
}

Deb.prototype.pack = function (definition, files, callback) {
  async.series([
    buildControlFile.bind(this, definition),
    packFiles.bind(this, files),
    function buildPackage(done) {
      var pkgName = './' + definition.control.Package + '_' + definition.control.Version + 
        '_' + definition.control.Architecture + '.deb';
        
      console.log('creating %s package', pkgName);  
      var writer = new ar.ArWriter(pkgName, {variant: 'gnu'});
      writer.writeEntries([
        './debian-binary',
        './control.tar.gz',
        './data.tar'
      ], done);
    }
  ], callback);
};

/**
 * Build the control part of the .deb package.
 */
function buildControlFile(definition, callback) {
  var self = this;
  
  // create the control file
  async.parallel([
    function createControlFile (prlDone) {
      var controlHeader = '';
      async.forEachOf(definition.control, function (value, key, done) {
        controlHeader += key + ': ' + value + '\n';
        done();
      }, function (err) {
        if (err) {
          console.error('could not write control file');    
          return prlDone(err);
        }
        
        self.control.entry({name: './control'}, controlHeader, prlDone);
      });    
    }
  ], function (err) {
    if (err) {
      console.error('could not write control tarball');
      return callback(err);
    }
    
    console.log('successfully created control file');
    
    self.control.finalize();
    
    var file = fs.createWriteStream(path.resolve('./' + 'control.tar.gz'));
    file.on('finish', callback);
    self.control.pipe(gunzip()).pipe(file);
  });
};

/**
 * Add files to the .deb package.
 * 
 * @param files - an object with the following format {'path/to/source/dir': 'path/to/target/dir'} (e.g. {'../../src/lib': '/srv/productName/lib'})
 */
function packFiles(files, callback) {
  var self = this;
    
  async.eachSeries(files, function (crtFile, done) {
    var filePath = path.resolve(crtFile.src[0]);
    fs.stat(filePath, function (err, stats) {
      if (err)
        return done(err); 
              
      if (!stats.isDirectory()) {
        fs.readFile(filePath, function (err, data) {
          if (err)
            return done(err);
            
          self.data.entry({
            name: '.' + crtFile.dest,
            size: stats.size
          }, data, done);
        });          
      } else {
        addParentDirs(self.data, crtFile.dest, self.dirs, done);
      }
    });
  }, function (err) {
    if (err) {
      console.error('there was a problem adding files to the .deb package: ', err);
      callback(err);
    } else {
      console.log('successfully added files to .deb package');
    
      self.data.finalize();
      
      var file = fs.createWriteStream(path.resolve('./' + 'data.tar'));
      file.on('finish', callback);
      self.data.pipe(file);  
    }
  });
};

function addParentDirs(tarball, dir, createdDirs, callback) {
  var self = this;
  if (dir !== '/') {
    addParentDirs(tarball, path.dirname(dir), createdDirs, function (err) {
      if (err)
        return callback(err);
      
      addDir();
    });
  } else {
    addDir();
  }
  
  function addDir() {
    if (!createdDirs[dir]) {
      createdDirs[dir] = 1;
      tarball.entry({name: '.' + dir, type: 'directory'}, callback);
    } else {
      callback();
    }
  }
}

module.exports = function () {
  return new Deb();
};
