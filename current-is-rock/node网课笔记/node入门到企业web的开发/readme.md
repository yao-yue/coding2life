## node入门到企业web的开发笔记

### 大纲
-    nodejs介绍
-    简单web Server
-    调试
-    单元测试 及发布
-    基础API
-    爬虫

### nodejs是什么
基于V8引擎 非阻塞I/O 事件驱动（异步操作完成后的同志，观察者模式）
### nodeJs优点
cpu密集  I/O密集
高并发应对之道
多进程  --> 多线程  --> 事件驱动
单线程只是针对主进程，I/O底层是多线程 
- 常用场景
web Server 
本地代码构建 webpack
实用工具开发

### 环境和调试
1. commonjs 
一个文件就是一个模块，有自己的作用域
在模块内部module变量代表模块本身
module.exports 暴露
require支持js json node拓展名
require特性： 
module被加载的时候执行，加载后缓存
一旦某个模块被循环加载，只输出已经执行的部分，还未执行的部分不会输出