var PATH_TO_INSTALL = '/var/www/html/NGM/chatcenter';


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    /***
     * Tarea mediante la cual podemos correr comandos en el shell del SO,
     *  en expand la usamos para instalar dependencias del frontEnd
     ***/
    shell: {
      checkSassSyntax: {
        options: {
          stdout: true
        },
        command: [
          'echo Chequeando la syntaxis del codigo sass',
          'scss-lint sass/ -x SelectorFormat,ColorVariable,NestingDepth',
          'echo Chequeo de syntaxis sass finalizado'
        ].join('&&')
      },

      clean: {
        options: {
          stdout: true
        },
        command: [
          'echo Eliminando viejas instalaciones',
          'rm -rf <%= config.installPATH %>'
        ].join('&&')
      },

      concat: {
        options: {
          stdout: true
        },
        command: [
          'mkdir -p build/',
          'sh enyo/tools/minify.sh package.js -no-alias -output build/eXpandCC'
        ].join('&&')
      },

      replaceinHTML: {
        options: {
          stdout: true
        },
        command: [
          'echo Configurando el proyecto para su uso..',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>develop.html',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>debug.html',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>no_debug.html',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>skyblue.html',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>traditional.html',
          'sed -i s/{{installIP}}/<%= config.installIP %>/g <%= config.htmlPATH %>violet.html',
        ].join('&&')
      },

      help: {
        options: {
          stdout: true
        },
        command: [
          'echo Puede ver este archivo en la carpeta /docs',
          'cat docs/docs.txt'
        ].join('&&')
      }
    },

    /***
     * Crea un unico archivo javascript y un unico archivo css con todo
     * lo necesario para que alcanze incluir esto y quede funcional.
     ***/
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      js: {
        src: [
          'lib/*.js',
          'js/tmp/templates.js',
          'js/utils.js',
          'js/config.js',
          'js/xmpp.js',
          'js/expand_dom.js',
          'js/expand.js'
        ],
        dest: 'build/js/<%= pkg.name %>.js'
      },
      css: {
        src: ['css/*.css'],
        dest: 'build/css/<%= pkg.name %>.css'
      }
    },

    /***
     * Minifica y comprime el js.
     ***/
    uglify: {
      js: {
        options: {
          report: 'gzip',
          preserveComments: false,
          drop_console: true,
          compress: {
            drop_console: true
          },
          global_defs: {
            'DEBUG': false
          },
          dead_code: true
        },
        src: [
          'build/<%= pkg.name %>.js'
        ],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    /***
     *  Formatea el codigo javascript de acuerdo a lo configurado
     ***/
    jsbeautifier: {
      files: ['assets/js/*.js'],
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 5,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0,
          endWithNewline: true
        }
      }
    },

    /***
     * Genera codigo css a partir de codigo SASS
     ***/
    sass: {
      dist: {
        options: {
          noCache: true,
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },

    /***
     * Minifica y comprime el css.
     ***/
    cssmin: {
      styles: {
        options: {
          report: 'gzip',
          keepSpecialComments: 0,
          drop_console: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */',
        },
        files: {
          'build/<%= pkg.name %>.min.css': ['assets/css/*.css']
        }
      }
    },

    /***
     * Chequea la calidad del codigo
     ***/
    gjslint: {
      options: {
        reporter: {
          name: 'console' //report to console
        },
        force: false //don't fail if python is not installed on the computer
      },
      lib: {
        src: ['js/*.js'],
      }
    },

    /***
     * Chequea la calidad del codigo css
     ***/
    csslint: {
      strict: {
        options: {
          'box-sizing': false,
          'adjoining-classes': false,
          'compatible-vendor-prefixes': false,
          'qualified-headings': false,
          import: 2
        },
        src: ['css/*.css',
          'css-themes/*.css'
        ]
      }
    },

    /***
     * Chequea la calidad del codigo scss
     ***/
    scsslint: {
      allFiles: [
        'sass/*.scss',
      ],
      options: {
        bundleExec: true,
        // config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },

    /***
     * Agrega los prefix -moz, -web-kit, etc en los css
     *   chequeando contra la base can-i-use-db
     ***/
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('autoprefixer-core')({
            browsers: '> 5%, last 2 versions'
          }) // add vendor prefixes
        ]
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.css', // Obtengo los css generados por sass
        dest: 'css/' // Agrego los prefix y en el source
      }
    },

    /***
     * Corrige automaticamente errores de calidad en el codigo
     ***/
    fixjsstyle: {
      options: {
        reporter: {
          name: 'console'
        },
        force: false
      },
      lib: {
        src: ['js/*.js', 'tmp/*.js'],
      }
    },

    /***
     * Genera codigo javascript a partir de los templates escritos en HTML
     ***/
    htmlConvert: {
      options: {
        base: 'templates/',
        rename: '',
        quoteChar: '\''
      },
      mytemplate: {
        src: ['templates/*.html'],
        dest: 'js/tmp/templates.js'
      },
    },

    /***
     * Copia el projecto al PATH_TO_INSTALL
     ***/
    copy: {
      all: {
        cwd: '../cliente',
        src: ['build/**/*',
          'css/**/*',
          'css-themes/**/*',
          'html/**/*',
          'js/**/*',
          'lib/**/*',
          'img/**/*',
          'index.html'
        ],
        dest: PATH_TO_INSTALL + '/cliente',
        expand: true
      }
    },

    /***
     * Copia el projecto al PATH_TO_INSTALL
     ***/
    watch: {
      css: {
        files: 'sass/*.scss',
        tasks: ['sass']
      },
      html: {
        files: 'templates/*.html',
        tasks: ['template']
      }
    },

    /***
     * Se utiliza para agregarle a los archivos generados un encabezado
     *  con la fecha y hora en que fueron generados. Ademas se les agrega la
     *  descripcion y el nombre del modulo
     ***/
    usebanner: {
      addBanners: {
        options: {
          position: 'top',
          banner: '/* <%= pkg.name %> - v<%= pkg.version %>\n' +
            '   <%= pkg.description %>\n' +
            '   Generated <%= grunt.template.today("dd-mm-yyyy HH:MM") %> */\n',
          linebreak: true
        },
        files: {
          src: ['build/**/*.css', 'build/**/*.js']
        }
      }
    },

    /***
     * Sprite generator
     ***/
    sprite: {
      all: {
        src: ['img/*.png', '!img/sprite.png'],
        dest: 'img/sprite.png',
        destCss: 'sass/_spriteVars.scss',
        cssFormat: 'scss'
        /*,
        cssVarMap: function (sprite) {
          var pkg = grunt.file.readJSON('package.json');
          sprite.name =  pkg.name + '-' + sprite.name;
        }*/
      }
    }

  });

  /* For general use */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  /* For javascript */
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-convert');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  /* For styles */
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-banner');

  /****
   * TASKS - TO USE WITH 'GRUNT TASKNAME'
   ****/
  grunt.registerTask('installDep', ['shell:installDep']);

  grunt.registerTask('help', ['shell:help']);


  grunt.registerTask('template', ['htmlConvert']);

  grunt.registerTask('quality', ['gjslint']);

  grunt.registerTask('qualitycss', ['sass',
    'csslint'
  ]);

  grunt.registerTask('fixquality', ['fixjsstyle']);

  grunt.registerTask('compress', ['uglify',
    'cssmin'
  ]);

  grunt.registerTask('make-sprite', ['sprite']);

  grunt.registerTask('compile', ['quality',
    'shell:checkSassSyntax',
    'qualitycss',
    'sass',
    'htmlConvert',
    'postcss',
    'shell:concat',
    'compress',
    'usebanner',
    'jsbeautifier'
  ]);

  grunt.registerTask('deploy', ['compile',
    'shell:clean',
    'copy',
    'shell:replaceinHTML'
  ]);

  grunt.registerTask('install', ['compile',
    'shell:clean',
    'copy',
    'shell:replaceinHTML'
  ]);

  grunt.registerTask('default', ['install']);

};
