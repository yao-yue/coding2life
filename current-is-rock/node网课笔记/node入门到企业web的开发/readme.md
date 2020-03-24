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
exports = module.exports  //相当于快捷方式
2. global对象
timer process console Buffer
3. process对象
- 参数相关 argv, argv0, execArgv, execPath
- 环境相关env   process.cwd()
4. 调试技巧
inspector   node --inspect-brk 
vscode
条件调试  在特定条件下进入断点

### 基础API
1. path  resolve 把相对路径转换成绝对路径
2. event  
const EventEmitter = require('event');
主动通知 继承了EventEmitter  
触发emit  
监听 on('动作 ',回调)
removeLitener() 移除监听
一个事件能绑定多个回调

### 做一个命令行工具

### 单元测试
断言 assert
assert.equal()
断言库
测试 覆盖率

### 持续集成
1. 频繁的将代码集成到主干
2. 每次集成都通过自动化的构建来验证

尽早的发现错误           
防止分支大幅偏离主干
build passing
coverage
