## 开课吧  node音乐项目
> 2018年8月的项目 但是不影响，先把精髓学了才好学别的项目

### 项目功能
1. 登录
2. 注册
3. 添加音乐
4. 播放音乐
5. 编辑音乐
6. 删除音乐

### 项目依赖
```
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


## 模板拆分引用及继承
中部留坑
```
main.html
{{block 'content'}}
默认内容
{{/block}}
    
{{extend './layout/main.html'}}
{{block 'content'}}
子页面内容
{{/block}}
```


### MVC
C：接收数据 生成视图
路由： url --> 做什么事（controller来安排，业务经理）
controller： 接收数据 响应页面


### api流程
router注册 --> controller逻辑  ---> models弄数据库搞数据


### 关于formidable处理文件及字符串
用bodyParser不太好处理文件

### 写出来的bug真的搞笑😀
localhost  写成 loaclhost
from   写成  form