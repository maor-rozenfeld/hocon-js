module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      files: ['tests.html']
    },
    umd: {
      build: {
        options: {
          src: './hoconjs.js',
          dest: './build/hoconjs.js',
          objectToExport: 'parseHocon'
        }
      }
    },
    uglify: {
      build: {
        files: {
          './build/hoconjs.min.js': ['./build/hoconjs.js']
        }
      },
      options: {
        mangle: true,
        sourceMap: true
      }
    }
  });

  // Load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Tasks
  grunt.registerTask('test', 'qunit');
  grunt.registerTask('release', ['umd:build', 'uglify:build']);

};
