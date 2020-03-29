## notes 

### 小点
1.  Controller 有 class 和 exports 两种编写方式
2. static 插件默认映射 /public/* -> app/public/* 目录,我们将其放进去即可
3. 修女 nunjucks(南甲克丝)
4. Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。Controller:职责,接收数据，渲染页面， 复杂业务逻辑在service里面处理
5. 框架提供了一种快速扩展的方式，只需在 app/extend 目录下提供扩展脚本
6. 中间件要在config里面配置
7. 配置： 写业务的时候，不可避免的需要有配置文件，框架提供了强大的配置合并管理功能。支持按环境变量加载不同的配置文件，如 config.local.js， config.prod.js 等等。
应用/插件/框架都可以配置自己的配置文件，框架将按顺序合并加载
8. 单元测试非常重要，框架也提供了 egg-bin 来帮开发者无痛的编写测试
9. 代码的共建，复用和下沉?