const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env['NODE_ENV'] === 'production';
const src = path.join(__dirname, 'src');

let environment = 'production';
if (
  !(
    isProduction &&
    process.env.CIRCLE_BRANCH &&
    (process.env.CIRCLE_BRANCH.indexOf('master') !== -1 ||
      process.env.CIRCLE_BRANCH.indexOf('beta') !== -1)
  )
) {
  environment = 'development';
}

const config = {
  entry: path.join(src, 'main.ts'),
  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  watchOptions: {
    ignored: [],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(otf|ttf|eot|svg|gif|jpe?g|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name(file) {
            return file
              .replace(path.join(__dirname, 'src', path.sep), '')
              .split(path.sep)
              .join('/');
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      GC_PRODUCTION: isProduction,
      ENVIRONMENT: JSON.stringify(environment),
    }),
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets',
      },
    ]),
  ],
};

module.exports = config;
