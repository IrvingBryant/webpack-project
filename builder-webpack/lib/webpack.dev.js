const merge = reqiure('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'devleopment',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // webpack 自带的热更新插件
  ],
  devServer: {
    contentBase: './dist', // 设置热更新的目录
    hot: true, // 设置热更新
    stats: 'errors-only', // 打包日志优化
  },
  devtool: 'source-map',
};

module.exports = merge(baseConfig, devConfig);
