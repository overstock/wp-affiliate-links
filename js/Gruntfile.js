/*
Install all dependant libraries:
npm install grunt
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-uglify --save-dev

To run the compiler:
grunt
*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			'dist/overstock-plugin.js': 		[
												'src/libs/jquery.min.js',
												'src/libs/flexslider.min.js',
												'src/plugin/plugin-script.js'
												], //Compile plugin JS
			'../api/js/overstock-embed.js': [
												'src/libs/jquery.min.js',
												'src/libs/flexslider.min.js',
												'src/api/patterns.js',
												'src/api/functions.js',
												'src/api/product-data.js',
												'src/api/overstock-shortcodes.js',
												'src/api/overstock-embed.js',
												'src/api/api-script.js'
												] //Compile embed API JS 
		},
		uglify: {
			my_target: {
				files: {
					'dist/overstock-plugin.min.js': ['dist/overstock-plugin.js'], //Minify plugin JS
					'../api/js/overstock-embed.min.js': ['../api/js/overstock-embed.js'] //Minify embed API JS
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
