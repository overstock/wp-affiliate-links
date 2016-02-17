/*
===== Grunt Compile Overstock Plugin CSS =====

1) Install all dependant libraries:
npm install;

2) Run the compiler:
grunt
*/
module.exports = function(grunt) {

	//Load Tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Compile embed Plugin LESS to CSS
		less: {
			css: {
				src: ['css/src/less/main.less'],
				dest: 'css/overstock-plugin.css'
			}
		},

		//Append library CSS files to the Plugin CSS
		concat: {
			dist: {
				src: [
					'css/overstock-plugin.css',
					'css/src/libs/font-awesome.min.css',
				],
				dest: 'css/overstock-plugin.css'
			}
		},

		//Minify embed Plugin CSS
		cssmin: {
			compress: {
	        	files: {
		          	'css/overstock-plugin.min.css': ['css/overstock-plugin.css'], //Minify plugin CSS 
	        	}
			}
		},

		//Live Reload
		watch: {
	      src: {
	        files: ['css/src/less/*.less', 'css/src/less/*/*.less'],
	        tasks: ['less', 'concat', 'cssmin'],
	        options: {
	          livereload: true,
	          port: 9000
	        }
	      }
		}

	});

	//Default task
	grunt.registerTask('default', ['less', 'concat', 'cssmin']);

};