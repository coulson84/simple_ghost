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
        }

    });

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }
};