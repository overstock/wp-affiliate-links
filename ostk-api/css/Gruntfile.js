module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			css: {
				src: ['src/main.less'],
				dest: 'dest/<%= pkg.name %>.css'
			}
		},
		cssmin: {
			compress: {
	        	files: {
		          	'dest/<%= pkg.name %>.min.css': ['dest/<%= pkg.name %>.css']
	        	}
			}
		}
	});

	//Enable plugins
	grunt.loadNpmTasks('grunt-contrib-less'); //Compile Less To CSS
	grunt.loadNpmTasks('grunt-contrib-cssmin'); //Minify CSS

	//Default Task
	grunt.registerTask('default', ['less', 'cssmin']);

};
