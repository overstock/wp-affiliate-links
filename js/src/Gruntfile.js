/*
===== Grunt Compile Overstock Plugin JS =====

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
					'js/overstock-plugin.js'
				],
				dest: '../overstock-plugin.js'
			}
		},

		//Minify Plugin JS
		uglify: {
			my_target: {
				files: {
					'../overstock-plugin.min.js': ['../overstock-plugin.js'], //Minify plugin JS
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
