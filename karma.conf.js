var path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      'test/**/*.js'
    ],

    preprocessors: {
      'lib/**/*.js': ['babel', 'browserify'],
      'test/**/*.js': ['babel', 'browserify']
    },

    plugins: [
      'karma-babel-preprocessor',
      'karma-browserify',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
    ],

    babelPreprocessor: {
      options: {
        presets: ['airbnb'],
        sourceMap: 'inline'
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
  })
};
