module.exports = function (grunt) {
  grunt.initConfig({
    deb: {
      ia: {
        options: {
          control: {
            Package: 'installeranalytics',
            Version: '1.0.1-4088',
            Section: 'misc',
            Priority: 'optional',
            Architecture: 'amd64',
            Depends: '',
            Maintainer: 'Dragos Sebestin dragos.sebestin@gmail.com',
            Description: 'my description will go here'
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