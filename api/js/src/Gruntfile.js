/*
===== Grunt Compile Overstock API Embed JS =====

1) Install all dependant libraries:
npm install grunt
npm install load-grunt-tasks --save-dev
npm install grunt-json --save-dev
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-uglify --save-dev

2) Run the compiler:
grunt
*/
module.exports = function(grunt) {

	//Load Tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
		        src: ['json/*.json'],
		        dest: 'patterns.js'
		    }
		},

		//Compile custom and library JS files into one file
		concat: {
			dist: {
				src: [
					//Libraries
					'libs/jquery.min.js',
					'libs/flexslider.min.js',

					//Widgets
					'widgets/*.js',

					//Functions
					'functions.js',
					'patterns.js',

					//Classes
					'classes/*.js',

					//Embed
					'overstock-embed.js'
				],
				dest: '../overstock-embed.js'
			}
		},

		//Minify Plugin JS
		uglify: {
			my_target: {
				files: {
					'../overstock-embed.min.js': ['../overstock-embed.js'] //Minify plugin JS
				}
			}
		}

	});

	//Default task
	grunt.registerTask('default', ['json', 'concat', 'uglify']);

};
