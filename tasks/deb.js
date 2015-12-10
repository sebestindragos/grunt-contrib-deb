var deb = require('../lib/deb.js');

module.exports = function (grunt) {
  grunt.registerMultiTask('deb', 'package node apps into debian installers', function() {
    var debPkg = deb();
    
    var done = this.async();
    
    debPkg.pack(this.options(), this.files, function (err) {
      done(err);
    });  
  });
};