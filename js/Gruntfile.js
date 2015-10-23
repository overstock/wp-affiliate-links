module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				src: 'src/script.js',
				dest: 'dest/<%= pkg.name %>.js',
			},
		},
		uglify: {
			my_target: {
				files: {
					'dest/<%= pkg.name %>.min.js': ['dest/<%= pkg.name %>.js']
				}
			}
		}
	});

	//Enable plugins
	grunt.loadNpmTasks('grunt-contrib-copy'); //Copy JS from 'src' to 'dest'
	grunt.loadNpmTasks('grunt-contrib-uglify'); //Minify JS

	//Default Task
	grunt.registerTask('default', ['copy','uglify']);

};
