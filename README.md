# grunt-contrib-deb

grunt task for creating .deb packages for linux. Can be run from Windows too.

## Getting started

This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-deb --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-deb');
```

## Deb task
_Run this task with the `grunt deb` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage

```js
grunt.initConfig({
  deb: {
    mytask: {
      options: {
        package: grunt.file.readJSON('./package.json'), // needed for extracting project info
        info: {
          rev: '512', // optional revision number
          arch: 'amd64', // optional architecture type
          targetDir: './dist', // optional folder where to build the .deb package
          scripts: {
            preinst: './deb/scripts/preinst', // optional pre install script
            postinst: './deb/scripts/postinst', // optional post install script
            prerem: './deb/scripts/prerem', // optional pre remove script
            postrem: './deb/scripts/postrem', // optional post remove script
          }
        }
      }, 
      files: [{
        src: ['src/**', '!tests/**'],
        dest: '/srv/myproject',
        cwd: './server',
        expand: true
      }, { // add configuration files (init scripts, logrotate, systemd, etc...)
        src: ['**'],
        dest: '/etc',
        cwd: './config',
        expand: true
      }]
    }
  }
});

grunt.loadNpmTasks('deb');

// ...

grunt.registerTask('deploy', ['deb']);
```

