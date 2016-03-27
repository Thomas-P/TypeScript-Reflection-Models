// Karma configuration
// Generated on Fri Mar 25 2016 16:46:35 GMT+0100 (Mitteleuropäische Zeit)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        plugins: [
            'karma-systemjs',
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['systemjs', 'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'lib/**/*.js',
            'test/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'lib/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing test whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the test and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity,

        systemjs: {
            // Path to your SystemJS configuration file
            configFile: 'system.conf.js',
            //defaultExtension: 'js',
            // Patterns for files that you want Karma to make available, but not loaded until a module requests them. eg. Third-party libraries.
            serveFiles: [
                //'lib/**/*.js',
                'node_modules/**/*.js'
            ]
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        coverageReporter: {
            type: "lcov",
            dir: "coverage/",
            subdir: "."
        }

    });
};
