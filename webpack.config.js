const webpack = require('webpack');
const path = require('path');

const paths = {
  src: path.resolve(__dirname),
  build: path.resolve(__dirname)
}

const uglifyConfig = {
  sourceMap: false,
  warnings: false,
  mangle: true,
  minimize: true
}

module.exports = {
  mode: 'production',
  entry: path.resolve(paths.src, 'index.js'),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: paths.build,
    filename: 'minhash.min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
    ]
  }
};