/*
===== Grunt Compile Overstock API Embed JS =====

1) Install all dependant libraries:
	npm install grunt
	npm install grunt-contrib-concat --save-dev
	npm install grunt-contrib-uglify --save-dev

2) Run the compiler:
	grunt
*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Compile custom and library JS files into one file
		concat: {
			dist: {
				src: [
					'libs/jquery.min.js',
					'libs/flexslider.min.js',
					'js/patterns.js',
					'js/functions.js',
					'js/overstock-embed.js',
					'js/product-data.js'
				],
				dest: '../overstock-embed.js'
			}
		},

		//Minify Plugin JS
		uglify: {
			my_target: {
				files: {
					'../overstock-embed.min.js': ['../overstock-embed.js'], //Minify plugin JS
				}
			}
		}
	});

	//Enable plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//Default task
	grunt.registerTask('default', ['concat', 'uglify']);

};
