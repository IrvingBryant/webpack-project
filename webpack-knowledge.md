## 文件监听
1. 使用修改package.json  watch:'webpack --watch'
    缺点： 每次需要手动刷新页面
  > 原理：轮询判断文件的字后编辑时间是否发生变化，每次存储文件的修改时间
  当某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来  
  ```
    package.json中添加： 
    script:{  
      "dev":"webpack --watch", //热更新且--open自动开始开启浏览器
    }
    module.export={
      watch:true,
      watchOptions:{
        ignored:/node_modules/, 
        // 默认为空，不监听的文件或者文件夹，支持正则
        aggregateTimeout:300,//监听到变化后会等300ms再去执行，默认300ms
        poll：1000,//设置每秒钟轮询次数 默认每秒轮询1000次
      }
    }
  ```
## 热更新：webpack-dev-server 或webpack-dev-middleware （这个更灵活可以将输出文件传递给服务器）
  > 1.wds不刷新浏览器 2.wds不输出文件，二是放在内存中（比文件监听更快）
  ```
    package.json中添加： 
    script:{  
      "dev":"webpack-dev-server --open", //热更新且--open自动开始开启浏览器
    } 
  ```
  > 原理： 
  <img src='./src/md-img/hot-img.png'/>  

  ## 什么是文件指纹 （打包后输出的文件名的后缀）
  > 注意：文件指纹无法和热更新一起使用  

  > Hash  
    和整个项目的构建相关，只要项目与修改，整个项目构建的hash值就会更改  

  > Chunkhash(js)  
    webpack打包的chunk有关，不同的entry会生成不同的chunkhash值（A页面JS修改不影响B页面js） 

    ```
      output:{
        path:path.join(__dirname,'dist'),
        filename:'[name]_[chunkhash:8].js' //[name]占位符 适用多入口文件 [chunkhash:8] 设置js的文件指纹生成长度为8的hash后缀
      },
    ```   


  > Contenthash（css）
    根据文件内容来定义hash，文件内容不变，则contenthash不变
  
  1. css 文件指纹
  <img src="./src/md-img/css-hash.png" />  
  2. 图片和字体文件指纹
  <img src="./src/md-img/图片文字指纹.png" />  

  ## 代码压缩  

  1. js文件压缩（webapck.4内置了uglifyjs-webpack-plugin模块默认已压缩，不需要做其他操作） 

  2. css文件压缩（optimize-css-assets-webpack-plugin 和 cssnano） 

  <img src="./src/md-img/css压缩.png"/>  

  3. html 文件压缩（html-webpack-plugin,设置参数压缩）  

  <img src="./src/md-img/html压缩.png">

  ## clean-webpack-plugin(构建自动清除dist文件夹)

  ## PostCsss 插件 autoprefixer 自动不起css3前缀
  
  <img src="./src/md-img/postcss.png"/>  

  ## 移动端css px自动转换成 rem  (px2rem-loader)  
  1. 手淘flexible布局（lib-flexible）

  <img src="./src/md-img/px-rem.png"/>

  ## 静态资源内联  

  <img src="./src/md-img/资源内联.png"/>  
  > raw-loader 实现html js 内联 
  <img src="./src/md-img/raw-loader.png"/>

  > 1. style-loader 实现css内联  
  > 2. html-inline-css-webpack-plugin （一般用这个）

<img src='./src/md-img/css内联.png'/>  

  ## 多页面打包通用方案

  <img src="./src/md-img/多页面应用打包.png"/>
  

  ## [sroucemap](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)  

  > sroucemap是一个信息文件，里面存储着位置信息，也就是说，转换后的代码的每一个位置，对应的转换前的位置。  

  1. 作用：  
    代码出错的时候的，可以直接显示原始代码，而不是压缩后的代码，便于开发者debugger  

  <img src="./src/md-img/sroucemap关键字.png" />  

  sroucemap 类型  

  <img src="./src/md-img/sroucemap类型.png" />  

  ## 提取页面公共资源  
  1. 通过cdn引入公共资源
    <img  src="./src/md-img/基础库分离.png"/>

  2. SplitChunksPlugin 插件进行公共脚本分离
    <img src="./src/md-img/splitChunksPlugin脚本分离.png"/>  

  ## tree shaking(摇树优化) 的使用和原理  
  <img src="./src/md-img/tree-shaking.png"/>  

  > DCE(Elimination)
  1. 代码不会被执行，不可到达
  2. 代码执行的结果不会被用到
  3. 代码只会影响死变量
  ```
    //这边不会被打包进去
    if(false){
      console.log('这段代码')
    }
  ```  

  > 原理:
  利用ES6模块的特点：
    1. 只能作为模块顶层出现
    2. import 的模块名只能是字符串常量
    3. import 引入是立即引入立即绑定的  

  代码擦除：然后在uglify阶段删除无用代码  

  ## Scope Hoisting  (减少函数声明代码和内存开销)
  1. 不使用用scope hoisting 的缺点： 

    > 大量的函数闭包包裹代码，导致体积增大  
    > 运行代码时创建的函数作用域变多，内存消耗变大  


  <img src="./src/md-img/scope-hoisting.png"/>  

  ## 代码分割  
  <img src="./src/md-img/code-split.png">  

  > 懒加载JS脚本的方式：
   1. CommonJs:require.ensure
   2. ES6:动态import（木有原生支持）  

  > 如何使用动态import
    1. 安装@babel/plugin-syntax-dynamic-import插件  
    2. 配置.babelrc "plugins":["@babel/plugin-syntax-dynamic-import"]  
  
  ## SSR打包

  > 客户端渲染和服务端渲染的区别  

  <img  src="./src/md-img/SSR.png"/>  

  ## 优化构建时命令行的显示日志  

  <img src="./src/md-img/log优化.png"/>  

  ## 功能模块设计和目录结构  

  <img src="./src/md-img/功能模块设计.png"/>  

  ## 使用ESLint规范构建脚本  
  


  
  
  





  