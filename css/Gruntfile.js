/*
Install all dependant libraries:
npm install grunt
npm install grunt-contrib-less --save-dev
npm install grunt-contrib-cssmin --save-dev

To run the compiler:
grunt
*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			css: { //Compile plugin CSS
				src: ['src/plugin/plugin-main.less'],
				dest: 'dist/overstock-plugin.css'
			},
			css: { //Compile embed API CSS
				src: ['src/api/api-main.less'],
				dest: '../api/css/overstock-embed.css'
			}
		},
		cssmin: {
			compress: {
	        	files: {

		          	'dist/overstock-plugin.min.css': ['dist/overstock-plugin.css'], //Minify plugin CSS 
		          	'../api/css/overstock-embed.min.css': ['../api/css/overstock-embed.css'] //Minify embed API CSS 
	        	}
			}
		}
	});

	//Enable plugins
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	//Default task
	grunt.registerTask('default', ['less', 'cssmin']);

};
