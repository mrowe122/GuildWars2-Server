const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('../paths')

module.exports = {
  mode: 'production',
  context: path.src,
  entry: ['./index'],
  output: {
    path: path.dist,
    filename: '[name].js'
  },
  resolve: {
    modules: [
      path.src,
      'node_modules'
    ],
    extensions: ['*', '.js', '.json'],
    mainFields: ['main', 'module']
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
            plugins: [
              'babel-plugin-transform-class-properties',
              [ 'transform-object-rest-spread', { 'useBuiltIns': true } ]
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    new Dotenv()
  ]
}
