/*
===== Grunt Compile Overstock Plugin CSS =====

1) Install all dependant libraries:
	npm install grunt
	npm install load-grunt-tasks --save-dev
	npm install grunt-contrib-less --save-dev
	npm install grunt-contrib-concat --save-dev
	npm install grunt-contrib-cssmin --save-dev

2) Run the compiler:
	grunt
*/
module.exports = function(grunt) {

	//Load Tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Compile embed API LESS to CSS
		less: {
			css: {
				src: ['less/main.less'],
				dest: '../overstock-plugin.css'
			}
		},

		//Append library CSS files to the API CSS
		concat: {
			dist: {
				src: [
					'../overstock-plugin.css',
					'libs/font-awesome.min.css',
				],
				dest: '../overstock-plugin.css'
			}
		},

		//Minify embed API CSS
		cssmin: {
			compress: {
	        	files: {
		          	'../overstock-plugin.min.css': ['../overstock-plugin.css'], //Minify plugin CSS 
	        	}
			}
		}
	});

	//Default task
	grunt.registerTask('default', ['less', 'concat', 'cssmin']);

};