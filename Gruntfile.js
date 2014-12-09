module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'server/**']
        },

        connect: {
            unit: {
                options: {
                    port: 8080,
                    hostname: 'localhost'
                }
            },
            hang: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    keepalive: true
                }
            }
        },

        'mocha-chai-sinon': {
            unit: {
                src: ['./tests/*.spec.js'],
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
        },

        processWords: {
            main: {
                src: ['./details/word.lst'],
                dest: './server/words/list.json'
            }
        }

    });

    grunt.registerTask('test', ['mocha-chai-sinon:unit'])

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    grunt.loadTasks('./resources/grunt/');
};