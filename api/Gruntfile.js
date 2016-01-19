/*
===== Grunt Compile Overstock API Embed CSS =====

1) Install all dependant libraries:
npm install grunt;
npm install load-grunt-tasks --save-dev;
npm install grunt-contrib-less --save-dev;
npm install grunt-json --save-dev;
npm install grunt-css-important --save-dev
npm install grunt-contrib-cssmin --save-dev;
npm install grunt-contrib-concat --save-dev;
npm install grunt-contrib-uglify --save-dev;
npm install grunt-contrib-watch --save-dev;
npm install grunt-string-replace --save-dev;

2) Run the compiler:
grunt watch

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
				dest: 'dist/overstock-embed.css'
			}
		},

		//Make all lines of the css important. 
		//Crappy but needed because the widgets are being put on other peoples sites.
		css_important: {
			files: {
	            src: ['dist/overstock-embed.css'],
	            dest: 'dist/overstock-embed.css'
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
		        dest: 'js/src/patterns.js'
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
					'dist/overstock-embed.css'
				],
				dest: 'dist/overstock-embed.css'
			},
			js: {
				src: [
					//Widgets
					'js/src/widgets/*.js',

					//JS Files
					'js/src/*.js',

					//Classes
					'js/src/classes/*.js'
				],
				dest: 'dist/overstock-embed.js'
			}
		},

		//Minify API Embed CSS
		cssmin: { 
			compress: {
	        	files: {
		          	'dist/overstock-embed.min.css': ['dist/overstock-embed.css']
	        	}
			}
		},

		//Replace string for deployment
		'string-replace': {
			dist: {
			    files: {
					'dist/overstock-embed.js': 'dist/overstock-embed.js'
			    },
			    options: {
					replacements: [
						{
							//Relative img paths for local testing, hardcoded ostk urls for the live build
							pattern: /dev\/devImages\//ig,
							replacement: 'http://ak1.ostkcdn.com/img/mxc/'
						},
						{
							//Testing api url to live api url
							pattern: /api.test.overstock.com/ig,
							replacement: 'api.overstock.com'
						},
						{
							//Testing mid to live mid
							pattern: /24513/ig,
							replacement: '38601'
						},
						{
							//Local api css to production api
							pattern: /http:\/\/localhost:8080\/dist\/overstock-embed.min.css/ig,
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
					'dist/overstock-embed.min.js': ['dist/overstock-embed.js'] //Minify plugin JS
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
		        	// //JS
		        	'js/src/functions.js',
		        	'js/src/overstock-embed.js',
		        	'js/src/*/*.js',
		        	// //JSON
		        	'js/src/json/*.json'
		        ],
		        tasks: ['less', 'json',  'css_important', 'concat', 'cssmin', 'string-replace', 'uglify'],
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
	grunt.registerTask('default', ['less', 'json',  'css_important', 'concat', 'cssmin', 'string-replace', 'uglify']);
	grunt.registerTask('server', ['connect', 'watch']);
};