var deb = require('./lib/deb.js');

(function () {
  var debPkg = deb(__dirname);
  
  var files = {
    '../license-management/': '/srv/ia',
    '../JobIA/cloud': '/'
  };
  
  debPkg.packFiles(files);
})();