module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'server/**']
        },

        processWords: {
            main: {
                src: ['./details/word.lst'],
                dest: './server/words/list.json'
            },
            test: {
                src: ['./details/word.lst'],
                dest: './test/files/list.json'
            }
        },

        uglify: {
            main: {
                src: ['js/*'],
                dest: './public/js/all.js'
            }
        }

    });

    grunt.registerTask('init', ['processWords','jshint','uglify:main']);

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    grunt.loadTasks('./resources/grunt/');
};