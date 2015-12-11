module.exports = function (grunt) {
  grunt.initConfig({
    deb: {
      ia: {
        options: {
          package: grunt.file.readJSON('./package.json'),
          info: {
            rev: '4088',
            arch: 'amd64',
            //targetDir: '../JobIA/dist/'
            scripts: {
              postinst: './test/control/postinst',
            }
          }
        },
        files: [{
          src: ['ia-2.2.0-r4088/webapp/server/**'],
          dest: '/srv/ia',
          cwd: '../JobIA/dist',
          expand: true
        }, {
          expand: true,
          src: ['**'],
          dest: '/',
          cwd: '../JobIA/cloud'
        }]
      }
    }
  });
  
  grunt.loadNpmTasks('deb');
  
  grunt.registerTask('default', 'deb');
};