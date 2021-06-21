## webpack-demo

## 思考
webpack是用来干嘛的？打包，所有依赖打包成由一个依赖引入。 

执行 npx webpack，会将我们的脚本 src/index.js 作为 入口起点，也会生成 dist/main.js 作为 输出 

**webpack 是一个打包工具，gulp 是一个自动化工具。**\n
gulp中可以使用webpack,他们之间的交集不多，各司其职



### 静态资源
npm install --save-dev style-loader css-loader 
模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行 

你可以 import 这四种类型的数据(JSON, CSV, TSV, XML)中的任何一种.在使用 d3 等工具实现某些数据可视化时，这个功能极其有用。可以不用在运行时再去发送一个 ajax 请求获取和解析数据，而是在构建过程中将其提前加载到模块中，以便浏览器加载模块后，直接就可以访问解析过的数据。

还可以通过自定义的pa'rser，可以直接import各种类型的数据，webpack会帮你处理好数据同时也处理好依赖

import的方式更加直观，无需依赖于含有全部资源的/assets目录

### 管理输出
npm install --save-dev html-webpack-plugin
用来更新html中的一些引用，当然这个只是它其中一个功能  
清理dist文件夹 
webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射  
通过 WebpackManifestPlugin 插件，可以将 manifest 数据提取为一个 json 文件以供使用。有时间可以深入了解


### 开发环境
source map： 用来追踪错误，可以将编译后的代码映射回原始源代码
webpack-dev-server：  热更新  
    [有很多配置可以进行配置](https://webpack.docschina.org/configuration/dev-server)  
    再补充还有热模块替换 
    webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，


### 代码分离
optimization： 最佳化
入口起点：使用 entry 配置手动地分离代码。
>   包含的重复模块可能会被引入到各个bundle中
>  ```index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
    ```
> 如果是一个html中使用多个入口还需配置
```
 optimization: {
    runtimeChunk: 'single',
  },
```

防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
动态导入：通过模块的内联函数调用来分离代码。
 
SplitChunksPlugin： 可以将公共的依赖模块提取到已有的入口 chunk 中，提取到一个新生成的 chunk  
移除了重复的依赖模块
- mini-css-extract-plugin: 用于将 CSS 从主应用程序中分离  

**动态导入**
 ECMAScript 提案 的 import() 语法 来实现动态导入
-----
import() 调用会在内部用到 promises。如果在旧版本浏览器中（例如，IE 11）使用 import()，记得使用一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise。
----
预获取和预加载
import(/* webpackPreload: true */ 'ChartingLibrary');
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
这会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部，指示着浏览器在闲置时间预取 login-modal-chunk.js 文件。
preload会在父chunk加载的时候以并行的方式开始加载  

顶层async await.
const { default: _ } = await import('lodash');
结合async和await使用能化简promise 

filename: '[name].[contenthash].js', //文件名后缀，避免缓存导致的更新失效  

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法。它们很少像本地的源代码那样频繁修改  

moduleIds: 'deterministic',避免模块的解析顺序发生变化时id改变造成的变化


### lib
库只能通过被 script 标签引用而发挥作用
output.library 配置项暴露从入口导出的内容
peerDependency   同代

场景： 如果使用者已经安装过一个库我们就应该把他外部化   
consumer(使用者) 应该已经安装过 lodash 。因此，你就可以放弃控制此外部 library ，而是将控制权让给使用 library 的 consumer。   
使用 externals 配置来完成 