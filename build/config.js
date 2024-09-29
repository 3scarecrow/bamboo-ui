const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const isDev = process.argv.indexOf('--develop') >= 0
const isWatch = process.argv.indexOf('--watch') >= 0
const demoSrc = path.resolve(__dirname, '../example')
const demoDist = path.resolve(__dirname, '../dist')
const src = path.resolve(__dirname, '../packages')
const dev = path.join(demoDist, 'packages')
const dist = path.resolve(__dirname, '../lib')

const components = fs
  .readdirSync(src)
  .map(pkgName => `${pkgName}/index`)

module.exports = {
  entry: components,

  isDev,
  isWatch,
  srcPath: src, // 源目录
  distPath: isDev ? dev : dist, // 目标目录

  demoSrc, // demo 源目录
  demoDist, // demo 目标目录

  wxss: {
    less: false, // 使用 less 来编写 wxss
    sourcemap: false, // 生成 less sourcemap
  },

  js: {
    webpack: true, // 使用 webpack 来构建 js
  },

  webpack: {
    mode: 'production',
    output: {
      // path: path.resolve(__dirname, '../lib'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [nodeExternals()], // 忽略 node_modules
    module: {
      rules: [{
        test: /\.js$/i,
        use: [{
          loader: 'thread-loader',
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }, {
          loader: 'eslint-loader',
        }],
        exclude: /node_modules/
      }, {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'thread-loader',
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }, {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true,
          },
        }, {
          loader: 'eslint-loader',
        }],
      }],
    },
    resolve: {
      modules: [src, 'node_modules'],
      extensions: ['.js', '.json'],
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    ],
    optimization: {
      minimize: false,
    },
    // devtool: 'source-map', // 生成 js sourcemap
    performance: {
      hints: 'warning',
      assetFilter: assetFilename => assetFilename.endsWith('.js')
    }
  },

  copy: ['./wxs', './[packageName]/demo'], // 将会复制到目标目录
}
