'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    less: {
      dist: {
        files: {
          'public/css/style.css': 'assets/styles/{,*/}*.less'
        },
        options: {
          sourceMap: true,
          sourceMapFilename: 'style.css.map'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.coffee'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'assets/styles/*.less'
        ],
        tasks: ['less'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/{,*/}*.handlebars'],
        options: {
          livereload: reloadPort
        }
      },
      coffee: {
        files: ['assets/scripts/{,*/}*.coffee'],
        tasks: ['coffee'],
        options: {
          livereload: reloadPort
        }
      },
      bower_concat: {
        files: ['assets/bower_components/*'],
        tasks: ['bower_concat'],
        options: {
          livereload: reloadPort
        }
      },
      handlebars: {
        files: ['assets/scripts/templates/{,*/}*.hbs'],
        tasks: ['handlebars']
      }
    },
    bower_concat: {
      dist: {
        dest: 'public/js/vendors.js',
        dependencies: {
          'backbone': ['jquery', 'underscore']
        }
      }
    },
    coffee: {
      options: {
        join: true,
        sourceMap: true
      },
      dist: {
        files: {
          'public/js/app.js': 'assets/scripts/{,*/}*.coffee'
        }
      }
    },
    handlebars: {
      dist: {
        options: {
          processName: function(filePath) {
            var pieces = filePath.split("/");
            return pieces[pieces.length - 1];
          },
          namespace: 'Handlebars.templates'
        },
        files: {
          'public/js/templates.js': 'assets/scripts/templates/{,*/}*.hbs'
        }
      }
    },
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'less',
    'handlebars',
    'bower_concat',
    'coffee',
    'develop',
    'watch'
  ]);
};
