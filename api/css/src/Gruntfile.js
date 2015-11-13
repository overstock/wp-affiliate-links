/*
===== Grunt Compile Overstock API Embed CSS =====

1) Install all dependant libraries:
	npm install grunt
	npm install grunt-contrib-less --save-dev
	npm install grunt-contrib-concat --save-dev
	npm install grunt-contrib-cssmin --save-dev

2) Run the compiler:
	grunt
*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Compile API Embed LESS to CSS
		less: {
			css: {
				src: ['less/embed-main.less'],
				dest: '../overstock-embed.css'
			}
		},

		//Append library CSS files to the API Embed CSS
		concat: {
			dist: {
				src: [
					'../overstock-embed.css',
					'libs/font-awesome.min.css',
					'libs/flex-slider.min.css'
				],
				dest: '../overstock-embed.css'
			}
		},

		//Minify API Embed CSS
		cssmin: { 
			compress: {
	        	files: {
		          	'../overstock-embed.min.css': ['../overstock-embed.css']
	        	}
			}
		}

	});

	//Enable plugins
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	//Default task
	grunt.registerTask('default', ['less', 'concat', 'cssmin']);

};