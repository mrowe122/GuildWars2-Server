const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('../paths')

module.exports = {
  mode: 'production',
  context: path.src,
  entry: ['./index'],
  output: {
    path: path.dist,
    filename: 'main.js'
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
  plugins: [
    new Dotenv()
  ]
}
