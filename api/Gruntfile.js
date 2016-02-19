/*
===== Grunt Compile Overstock API Embed CSS =====

1) Install all dependant libraries:
npm install;

2) Run the compiler:
grunt watch

2) Create Server:
grunt server

*/
module.exports = function(grunt) {

	//Load Tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Compile API Embed LESS to CSS
		less: {
			css: {
				src: ['css/src/less/embed-main.less'],
				dest: 'dist/api.css'
			}
		},

		//Make all lines of the css important. 
		//Crappy but needed because the widgets are being put on other peoples sites.
		css_important: {
			files: {
	            src: ['dist/api.css'],
	            dest: 'dist/api.css'
            }
		},

		//Compile all of the widget json files together as a JS object
		json: {
		    main: {
		        options: {
		            namespace: 'ostk_patterns',
		            includePath: false,
		            processName: function(filename) {
		            	return filename.toLowerCase();
		            }
		        },
		        src: ['js/src/json/*.json'],
		        dest: 'dist/api.js'
		    }
		},

		//Append library CSS files to the API Embed CSS
		concat: {
			css: {
				src: [
					//Libraries
					'css/src/libs/*.css',
					//Fonts
					'css/src/fonts/*.css',
					//Compiled CSS
					'dist/api.css'
				],
				dest: 'dist/api.css'
			},
			js: {
				src: [
					//Widgets
					'js/src/widgets/*.js',
					//JS Files
					'js/src/*.js',
					//Classes
					'js/src/classes/*.js',
					//Compiles Json JS
					'dist/api.js'
				],
				dest: 'dist/api.js'
			}
		},

		//Make a dev version of the deployed files
		copy: {
		  js: {
		    src: 'dist/api.js',
		    dest: 'dev/api.js',
		  },
		  css: {
		    src: 'dist/api.css',
		    dest: 'dev/api.css',
		  }
		},

		//Minify API Embed CSS
		cssmin: { 
			compress: {
	        	files: {
		          	'dist/api.min.css': ['dist/api.css']
	        	}
			}
		},

		//Replace string for deployment
		'string-replace': {
			dist: {
			    files: {
					'dist/api.js': 'dist/api.js'
			    },
			    options: {
					replacements: [
						{
							//Relative img paths for local testing, hardcoded ostk urls for the live build
							pattern: /dev\/devImages\//ig,
							replacement: 'http://ak1.ostkcdn.com/img/mxc/'
						},
						// {
						// 	//Testing api url to live api url
						// 	pattern: /api.test.overstock.com/ig,
						// 	replacement: 'api.overstock.com'
						// },
						{
							//Testing mid to live mid
							pattern: /24513/ig,
							replacement: '38601'
						},
						{
							//Local api css to production api
							pattern: /http:\/\/localhost:8080\/dist\/api.min.css/ig,
							replacement: 'http://www.overstock.com/css/affiliate-link-plugin/api.min.css'
						}

					]
			    }
			}
		},

		//Minify Plugin JS
		uglify: {
			my_target: {
				files: {
					'dist/api.min.js': ['dist/api.js'] //Minify plugin JS
				}
			}
		},

		//Live Reload
		watch: {
			src: {
		        files: [
		        	//Dev
		        	'index.html',
		        	//LESS
		        	'css/src/less/*.less',
		        	'css/src/less/*/*.less',
		        	//JS
		        	'js/src/functions.js',
		        	'js/src/api.js',
		        	'js/src/*/*.js',
		        	//JSON
		        	'js/src/json/*.json'
		        ],
		        tasks: ['less', 'json',  'css_important', 'concat', 'copy', 'cssmin', 'string-replace', 'uglify'],
		        options: {
		          livereload: true
				}
			}
		},

		//Create a dev server
	    connect: {
			server: {
				options: {
					port: 8080,
					base: './',
					livereload: true,
					open: true
				}
			}
	    }

	});

	//Default task
	grunt.registerTask('default', ['less', 'json',  'css_important', 'concat', 'copy', 'cssmin', 'string-replace', 'uglify']);
	grunt.registerTask('server', ['connect', 'watch']);
};