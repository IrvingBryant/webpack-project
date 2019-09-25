const merge = require('webpack-merge');
const OptiMizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base.js');
// 提取分离公共包
const prodConfig = {
  mode: 'production',
  plugin: [
    new OptiMizeCssAssetsWebpackPlugin({ // 设置css文件压缩
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    new HtmlWebpackExternalsPlugin({ // 提取公共包来减小打包后文件的大小
      externals: [
        {
          module: 'react',
          // entry: 'node_modules/react/index.js',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          // entry: 'node_modules/react-dom/index.js',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};


module.exports = merge(baseConfig, prodConfig);
