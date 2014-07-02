console.log("Starting Grunt");

module.exports = function(grunt){
  grunt.initConfig({

    coffee: {
      glob_to_multiple: {
        expand: true,
        cwd: 'src/plugins/',
        src: ['*.coffee'],
        dest: 'dist/plugins/',
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
      src: 'dist/warden.js',
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

    copy: {
      main: {
        expand: true, 
        cwd: 'src/', 
        src: ['*.js'], 
        dest: 'dist/'
      }
    },

    comments: {
      js: {
        options: {
          singleline: true,
          multiline: false
        },
        src: [ 'dist/warden.js' ]
      }
    },

    watch: {
      scripts : {
        files : ['test/specs/*.js', "src/*js"],
        tasks : ['copy', 'comments','jasmine']
      },
      coffee: {
        files: ['src/plugins/*.coffee'],
        tasks: ['coffee']
      }
    }  

  }); 
  
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');   
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-stripcomments'); 
  grunt.loadNpmTasks('grunt-devtools');

  grunt.registerTask('default', [
    "coffee",
    "uglify",
    "copy",
    "comments",
    "jasmine",
    "watch"
  ]);
  
};