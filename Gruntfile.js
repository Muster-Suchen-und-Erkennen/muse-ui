'use strict';

module.exports = function (grunt) {

    // By default, load all available grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var appConfig = {
        dir: {
            src: 'app',
            target: 'dist',
            tmp: '.tmp'
        },
        banner: '/*! <%= pkg.description %> | <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
    };

    grunt.initConfig({
        appConfig: appConfig,
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            options: {
                dot: true
            },
            target: ['<%= appConfig.dir.tmp %>', '<%= appConfig.dir.target %>']
        },
        htmlmin: {
            release: {
                options: {

                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= appConfig.dir.src %>',
                        src: ['*.html', 'templates/{,*/}*.html'],
                        dest: '<%= appConfig.dir.target %>'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: '<%= appConfig.banner %>',
                keepSpecialComments: 0
            }
        },
        useminPrepare: {
            html: '<%= appConfig.dir.src %>/index.html',
            options: {
                dest: '<%= appConfig.dir.target %>'
            }
        },
        usemin: {
            html: ['<%= appConfig.dir.target %>/{,*/}*.html'],
            css: ['<%= appConfig.dir.target %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= appConfig.dir.target %>']
            }
        },
        copy: {
            compile: {
                files: [
                    // Copy some basic stuff like images, views, etc.
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= appConfig.dir.src %>',
                        dest: '<%= appConfig.dir.target %>',
                        src: [
                            'images/**/*',
                            'views/**/*',
                            '*.xml'
                        ]
                    },
                    // Copy ionicons fonts
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= appConfig.dir.src %>/bower_components/ionicons',
                        dest: '<%= appConfig.dir.target %>/styles',
                        src: [ 'fonts/*' ]
                    },
                    // Copy glyphicons fonts
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= appConfig.dir.src %>/bower_components/bootstrap/dist',
                        dest: '<%= appConfig.dir.target %>/styles',
                        src: [ 'fonts/*' ]
                    },
                    // Copy select2 artifacts
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= appConfig.dir.src %>/bower_components/select2',
                        dest: '<%= appConfig.dir.target %>/styles/css',
                        src: [ 'select2.png', 'select2x2.png', 'select2-spinner.gif' ]
                    }
                ]
            },
            watch: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= appConfig.dir.tmp %>/concat',
                        dest: '<%= appConfig.dir.target %>',
                        src: [
                            'scripts/**/*'
                        ]
                    }
                ]
            }
        },
        concat: {
            // Mostly handled by 'usemin' task
            options: {
                sourceMap: true
            }
        },
        uglify: {
            options: {
                banner: '<%= appConfig.banner %>',
                sourceMap: true
            }
        },
        watch: {
            app: {
                files: [
                    '<%= appConfig.dir.src %>/**/*',
                    '!<%= appConfig.dir.src %>/bower_components/**/*',
                    '!<%= appConfig.dir.src %>/images/**/*'
                ],
                tasks: ['compile-watch'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            }
        },
        connect: {
            options: {
                port: 9009,
                protocol: 'http',
        
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: false,

                    base: [
                        '<%= appConfig.dir.tmp %>',
                        '<%= appConfig.dir.src %>'
                    ]
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'Gruntfile.js',
                '<%= appConfig.dir.src %>/javascript/controllers/{,*/}*.js',
                '<%= appConfig.dir.src %>/javascript/directives/{,*/}*.js',
                '<%= appConfig.dir.src %>/javascript/filters/{,*/}*.js',
                '<%= appConfig.dir.src %>/javascript/services/{,*/}*.js',
                '<%= appConfig.dir.src %>/javascript/templates/{,*/}*.js',
                '<%= appConfig.dir.src %>/javascript/*.js'
            ]
        }
    });

    grunt.registerTask('test', [

    ]);

    grunt.registerTask('compile', [
        'clean',
        'useminPrepare',
        'copy:compile',
        'concat',
        'cssmin',
        'htmlmin',
        'uglify',
        'usemin'
    ]);

    grunt.registerTask('compile-watch', [
        'clean',
        'useminPrepare',
        'copy:compile',
        'concat',
        'cssmin',
        'htmlmin',
        'copy:watch',
        'usemin'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'test',
        'compile'
    ]);

    grunt.registerTask('server', [
        'connect',
        'watch'
    ]);

    grunt.registerTask('default', [
        'build',
        'server'
    ]);
};