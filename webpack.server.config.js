const path = require('path');
const webpack = require('webpack');

const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {server: './server.ts'},
  resolve: {extensions: ['.js', '.ts']},
  target: 'node',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/(node_modules|main\..*\.js)/],
  optimization: {
    minimize: false
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for "WARNING Critical dependency: the request of a dependency is an expression"
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    ),
    new NormalModuleReplacementPlugin(/quill.js/, path.resolve(__dirname, 'src/app/shared/servermocks/quill.js')),
    new NormalModuleReplacementPlugin(/ngx-quill/, path.resolve(__dirname, 'src/app/shared/servermocks/quillmodule.mock.ts')),
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        keep_classnames: true,
        keep_fnames: true
      }
    }),
  ]
};