/**
 * Grunt file for our task runner and build process
 */

module.exports = function(grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dev: '_public/dev',
			dist: '_public/dist'
		},
		copy: {
			src: [
				'favicons/**/*',
				'fonts/**/*',
				'vendor-bower/**/*.js',
				'vendor-manual/**/*.js',
				'phi/ui-ix/**/*.js',
				'phi/ui-ix/img/**/*'
			],
			dev: {
				src: '<%= copy.src %>',
				dest: '_public/dev',
				expand: true,
				cwd: './front-end'
			},
			prod: {
				src: '<%= copy.src %>',
				dest: '_public/dist',
				expand: true,
				cwd: './front-end'
			}
		},
		concat: {
			options: {
				banner: '/*! <%= pkg.name %> | Version: <%= pkg.version %> | ' +
						'Concatenated on <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
				separator: '\n\n;// End of file\n\n'
			},
			main: {
				src: 'front-end/js/*.js',
				dest: '_public/dev/js/main.js'
			}
		},
		watch: {
			js: {
				files: '<%= jshint.files %>',
				tasks: ['jshint', 'concat', 'macreload']
			},
			scss: {
				files: 'front-end/sass/*.scss',
				tasks: ['compass:dev', 'macreload']
			}
		},
		jshint: {
			files: [
				'*.js',
				'middle-end/**/*.js',
				'config/**/*.js',
				'test/**/*.js',
				'front-end/js/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'   // Retrieves .jshintrc file from _public/ See jshintrcExplained.js for more details
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> | Version: <%= pkg.version %> | ' +
						'Minified on <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
			},
			prod: {
				expand: true,           // Enable dynamic expansion.
				cwd: '_public/dev/js',   // Src matches are relative to this path.
				src: ['**/*.js'],       // Actual pattern(s) to match.
				dest: '_public/dist/js', // Destination path prefix.
				ext: '.js',             // Dest filepaths will have this extension.
				flatten: false          // Remove directory structure in destination
			}
		},
		compass: {
			prod: {
				options: {
					sassDir: 'front-end/sass',
					cssDir: '_public/dist/css',
					environment: 'production'
				}
			},
			dev: {
				options: {
					sassDir: 'front-end/sass',
					cssDir: '_public/dev/css'
				}
			}
		},
		macreload: {
			reload: {
				browser: 'canary'
			}
		},
		jasmine: {
			src: 'test/*helper.js',
			options: {
				specs: 'test/spec/*.spec.js'
			}
		}
	});

	// Load in contrib tasks
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Load in Markdown task
	//grunt.loadNpmTasks('grunt-markdown');

	// Load the "Live Reload" alternative
	grunt.loadNpmTasks('grunt-macreload');

	// Test JS Code
	grunt.registerTask('test', ['jshint', 'jasmine']);

	// Default dev tasks for grunt.
	grunt.registerTask('default', ['clean:dev', 'concat',  'copy:dev', 'compass:dev']);

	// Production build task.
	grunt.registerTask('build', ['test', 'clean:prod', 'concat', 'copy:prod', 'uglify', 'compass:prod']);

};
