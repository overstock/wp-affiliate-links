/*
===== Grunt Compile Overstock API Embed CSS =====

1) Install all dependant libraries:
npm install grunt;
npm install load-grunt-tasks --save-dev;
npm install grunt-contrib-less --save-dev;
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-json --save-dev;
npm install grunt-contrib-uglify --save-dev;

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
				dest: 'css/overstock-embed.css'
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
			dist: {
				src: [
					'css/overstock-embed.css',
					'css/src/libs/font-awesome.min.css',
					'css/src/libs/flex-slider.min.css'
				],
				dest: 'css/overstock-embed.css'
			},
			dist: {
				src: [
					//Libraries
					'js/src/libs/jquery.min.js',
					'js/src/libs/flexslider.min.js',

					//Widgets
					'js/src/widgets/*.js',

					//Functions
					'js/src/functions.js',
					'js/src/patterns.js',

					//Classes
					'js/src/classes/*.js',

					//Embed
					'js/src/overstock-embed.js'
				],
				dest: 'js/overstock-embed.js'
			}
		},

		//Minify API Embed CSS
		cssmin: { 
			compress: {
	        	files: {
		          	'css/overstock-embed.min.css': ['css/overstock-embed.css']
	        	}
			}
		},

		//Minify Plugin JS
		uglify: {
			my_target: {
				files: {
					'js/overstock-embed.min.js': ['js/overstock-embed.js'] //Minify plugin JS
				}
			}
		},

		//Live Reload
		watch: {
	      src: {
	        files: [
	        	//LESS
	        	'css/src/less/*.less',
	        	'css/src/less/*/*.less',
	        	//JS
	        	'js/src/*.js',
	        	'js/src/*/*.js',
	        	//JSON
	        	'js/src/json/*.json'
	        ],
	        tasks: ['less', 'json', 'concat', 'cssmin', 'uglify'],
	        options: {
	          livereload: true,
	          port: 9999
	        }
	      }
		}

	});

	//Default task
	grunt.registerTask('default', ['less', 'json', 'concat', 'cssmin', 'uglify']);

};