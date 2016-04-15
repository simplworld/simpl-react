var path = require("path");
var glob = require("glob")
var webpack = require('webpack');


var entry_points = {
  index: [
  ]
}

glob.sync("src/**/*.js")
.forEach(function(_path) {
  var filename = _path.split('/').slice(-1)[0]
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
    entry_points.index.push(path.resolve(_path.split('.').slice(0, -1).join('.')))
  }})

process.stdout.write("Entry points: " + JSON.stringify(entry_points) + '\n')

var config = {
  context: __dirname,
  entry: entry_points,
  output: {
      filename: "index.min.js"
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx', '.json']
  },
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
        include: [path.resolve(__dirname, 'src')],
        exclude: /(node_modules|bower_components)/,
        loader: "babel"
      }
    ],
    noParse: [/\.min\.js/, /\.md/]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    })
  ]
}

module.exports = config;
