const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new HtmlWebPackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /dist/,
          /\.test\.tsx?$/,
        ]
      },
      {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
      },
      // mp3
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/sounds/',
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'dist'),
    ],
    compress: true,
    port: 9000,
  },
  mode: 'production',
  target: 'web'
};