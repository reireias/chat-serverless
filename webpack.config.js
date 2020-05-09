const path = require('path')
const WebpackBarPlugin = require('webpackbar')

module.exports = {
  mode: 'production',
  entry: {
    handler: path.resolve(__dirname, './server/handler.js'),
    auth: path.resolve(__dirname, './server/auth.js'),
    local: path.resolve(__dirname, './local.js'),
  },
  output: {
    path: path.resolve(__dirname, './.nuxt/dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  externals: ['nuxt'],
  stats: 'errors-only',
  plugins: [
    new WebpackBarPlugin({
      name: 'Serverless',
      color: '#228be6',
    }),
  ],
}
