const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('../paths')

module.exports = {
  mode: 'production',
  context: path.mock,
  entry: ['./index'],
  output: {
    path: path.dist,
    filename: 'mock.js'
  },
  resolve: {
    modules: [
      path.mock,
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
