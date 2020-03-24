### 准备开始
---


#### 项目功能

1. 登录
2. 注册
3. 添加音乐
4. 播放音乐
5. 编辑音乐
6. 删除音乐



#### 首要任务

1. 搭建项目骨架
2. 渲染所有页面



#### art-template模板继承

![1533043678052](assets/1533043678052.png)

![1533043680866](assets/1533043680866.png)



#### 测试

* 验证用户名![1533046308900](assets/1533046308900.png)



#### 项目依赖

* ```
  npm i  koa  koa-router koa-art-template art-template  koa-bodyparser  koa-static koa-session captchapng2  koa-formidable mysql -S
  ```

1. 项目框架 koa
2. 路由系统 koa-router
3. 页面渲染koa-art-template(依赖art-template)
4. 处理文字请求体数据  koa-bodyparser
5. 处理静态文件 koa-static
6. 处理登录后的session   koa-session
7. 生成验证码 captchapng2
8. 处理文件上传的 请求体数据  koa-formidable
9. 连接数据库  mysql
   1. 查找结果是数组![52759876950](assets/1527598769506.png)




* 静态资源![52760038922](assets/1527600389223.png)
* ![52760039346](assets/1527600393466.png)





#### 模板引擎的留坑

1. 抽离出公共的html部分
2. 在main中include这些部分
3. main中留坑,为变动的页面提供
4. 变动页面中extend main
5. 变动页面中block 填坑

#### 项目中涉及的新坑



1. 登录前后要有不同显示,模板引擎与koa通信时的数据交互__ctx.state,代码在app.js:71__
2. 回写到客户端的base64编码还能进行解码,不安全,需要sessionStore__,代码在app.js:27__
3. 静态文件将/public目录下的资源暴露,如:/css/xx.css ,与前端url:  /public 矛盾,需要重写url__,代码在app.js:44__
4. 排除/login或者/register 其他检查是否登录![52756938324](assets/1527569383248.png)
5. 播放音乐的时候audio标签接收到static中间件响应的头不标准,需要通过setHeaders函数来完善其头部__,代码在app.js:53__
   1. 前端代码滚动歌词的实现在views/index.html:81  ,主要分为几个步骤
      1. ajax请求歌词字符串,并解析成__{ 秒数:歌词 }__ 对象
      2. 通过 __{ 秒数:歌词 }__ 生成歌词DOM __<p time='秒数">歌词</[p>__
      3. 滚动时获取 audio播放事件,取秒,   查找DOM中p 相同秒的__元素的top值__
      4. 获取p与父容器间的top差, 从而得之该父容器要上移的距离

![52756918669](assets/1527569186692.png)