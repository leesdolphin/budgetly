module.exports = function (grunt) {
  grunt.initConfig({
    sass: {
      compile: {
        options: {
          style: 'expanded',
        },
        files: {
          "lib/css/index.css": "lib/scss/index.scss"
        }
      }
    },
    watch: {
      html: {
        files: ['**/*.html']
      },
      sass: {
        files: '<%= sass.compile.files[0].src %>',
        tasks: ['sass']
      },
      options: {
        livereload: true
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  return grunt.registerTask('default', ['sass', 'watch']);
};