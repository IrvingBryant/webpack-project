const glob = require('glob'); // golb是用来匹配文件的
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 用于每次构建自动清理文件
const HtmlwebpackPlugin = require('html-webpack-plugin');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// 快速生成html文件
const setMap = () => {
  const entry = {};
  const htmlwebpackPlugin = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js$/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      htmlwebpackPlugin.push(
        new HtmlwebpackPlugin(
          // 在模版文件中head中不能有注释不然会构件失败
          {
            template: path.join(__dirname, `./src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: [pageName],
            inject: true,
            minify: {
              html5: true,
              collapseWhitespace: true,
              preserveLineBreaks: false,
              minifyCSS: true,
              minifyJS: true,
              removeComments: false,
            },
            title: pageName,
          },
        ),
      );
    });

  return {
    entry,
    htmlwebpackPlugin,
  };
};
const {
  entry,
  htmlwebpackPlugin,
} = setMap();

module.exports = {
  // entry:'./src/index.js',
  // output:{
  //   path:path.join(__dirname,'dist'),
  //   filename:'bundle.js'
  // },
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // [name]占位符 适用多入口文件
  },
  module: { // webpack只能处理json和js 不能打包处理的文件使用loaders来打包装载
    rules: [
      // {test:/\.txt$/,use:'raw-loader'}, //test指定匹配规则 use指定使用的loader名称
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // 链式调用，从右至左的执行loader 所以先执行css-loader解析然后传递使用style-loader将样式插入head中
      // css-loader 用于加载.css文件，并且装换成commonjs对象
      // style-loader将样式通过<style>标签插入到head中
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, // 解析less文件 ,
      // {test:/\.(jpg|gif|png|svg)$/,use:'file-loader'},//图片解析
      {
        test: /\.(jpg|gif|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'img/[name][hash:8].[ext]', // 设置文件指纹ext表示资源后缀名
            limit: 20480, // 当图片大小小于20K的时候自动打包成base64
          },
        }],
      }, // 图片解析
      // {test:/\.(woff|woff2|eot|ttf|otf)/,use:'file-loader'}//字体解析

      // url-loader（内部还是用的file-loader） 与 file-loader 都可以处理图片和字体 可以设置较小资源自动base64
    ],
  },
  mode: 'development', // 用来指定当前构建的环境分别是: production 、development 、none
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // webpack 自带的热更新插件
    new CleanWebpackPlugin(),
    new friendlyErrorsWebpackPlugin(),
    ...htmlwebpackPlugin,
  ],
  devServer: {
    contentBase: './dist', // 设置热更新的目录
    hot: true, // 设置热更新
    stats: 'errors-only', // 打包日志优化
  },
  devtool: 'source-map',
};
