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
    
    includes: {
      build: {
        cwd: './src',
        src: './warden.js',
        dest: './src/build/',
        options: {
          duplicates: false,
          debug: true,
          includePath: './src/modules'
        }        
      },
    },

    // Jasmine test
    jasmine: {
      src: ['dist/warden.js'],
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
        cwd: 'src/build/', 
        src: ['*.js'], 
        dest: 'dist/'
      },
      plugins: {
        expand: true, 
        cwd: 'src/plugins', 
        src: ['*.js'], 
        dest: 'dist/plugins'
      }
    },

    comments: {
      js: {
        options: {
          singleline: true,
          multiline: false
        },
        src: [ 'dist/warden.js', "dist/plugins/*.js" ]
      }
    },

    watch: {
      scripts : {
        files : ['test/specs/*.js', "src/*.js", "src/**/*.js", "src/modules/*.js"],
        tasks : ['default']
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
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-devtools');

  grunt.registerTask('test', [
    "jasmine"
  ]);
  
  grunt.registerTask('build', [
    "coffee",
    "includes",
    "copy",
    "comments",
    "uglify",
    "jasmine"
  ]);
  grunt.registerTask('default', [
    "coffee",
    "includes",
    "copy",
    "comments",
    "uglify",
    "watch"
  ]);  
};