console.log("Starting Grunt");

module.exports = function(grunt){
  grunt.initConfig({

    coffee: {
      glob_to_multiple: {
        expand: true,
        cwd: 'src/',
        src: ['*.coffee'],
        dest: 'dist/',
        ext: '.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'dist/warden.min.js': ['dist/warden.js'],
        }
      }
    },

    // Jasmine test
    jasmine: {
      src: 'dist/warden.min.js',
      options: {
        specs: 'test/specs/*Spec.js',
        outfile : "test/_SpecRunner.html",
        keepRunner: true
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    watch: {
      scripts : {
        files : ['test/specs/*.js'],
        tasks : ['jasmine']
      },
      coffee: {
        files: ['src/*.coffee'],
        tasks: ['coffee']
      }
    },
  });
 
  
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');   
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine'); 
  grunt.loadNpmTasks('grunt-devtools');

  grunt.registerTask('default', [
    "coffee",
    "uglify",
    "jasmine",
    "watch"
  ]);
  
};