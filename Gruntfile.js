module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*\n' +
				' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
				' *  <%= pkg.description %>\n' +
				' *  <%= pkg.url %>\n' +
				' *\n' +
				' *  Made by <%= pkg.author %>\n' +
				' *  Under <%= pkg.license %> License\n' +
				' */\n'
    },

    concat: {
      scripts: {
        src: ['src/loading.js'],
        dest: 'dist/jquery.loading.js'
      },
      styles: {
        src: ['src/loading.css'],
        dest: 'dist/jquery.loading.css'
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    cssmin: {
      styles: {
        src: ['dist/jquery.loading.css'],
        dest: 'dist/jquery.loading.min.css'
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    uglify: {
      scripts: {
        src: ['dist/jquery.loading.js'],
        dest: 'dist/jquery.loading.min.js'
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    watch: {
      build: {
        files: ['src/**/*.js', 'src/**/*.css'],
        tasks: ['concat']
      },
      lint: {
        files: ['**/*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['jshint', 'concat']);
  grunt.registerTask('min', ['uglify', 'cssmin']);
  grunt.registerTask('default', ['build', 'min']);
};