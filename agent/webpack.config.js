import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

export default {
  entry: './server/index.js',
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  externals: [nodeExternals()],
  target: 'node',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  }
};
