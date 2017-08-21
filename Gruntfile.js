module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      files: ['tests/tests.html']
    },
    umd: {
      build: {
        options: {
          src: './src/hocon.js',
          dest: './index.js',
          objectToExport: 'parseHocon'
        }
      }
    },
    uglify: {
      build: {
        files: {
          'hocon.min.js': ['src/hocon.js']
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
