require('babel/register');
var path = require("path");
var webpack = require('webpack');


var config = {
  context: __dirname,
  entry: './lib/index',
  output: {
    filename: "./index.js",
    library: 'Simpl',
    libraryTarget: 'umd'
  },
  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
  node: {
    fs: "empty",
    tls: "empty"
  },
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json'},
      { test: /\.md$/, loader: 'html!markdown'},
    ],
    loaders: [
      {
        test: /\.js[x]?$/,
        include: [path.resolve(__dirname)],
        exclude: /(node_modules|bower_components)/,
        loader: "babel"
      }
    ],
    noParse: [/\.min\.js/, /\.md/]
  }
}

module.exports = config;
