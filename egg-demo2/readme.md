## notes 


### 小点
1.  Controller 有 class 和 exports 两种编写方式
2. static 插件默认映射 /public/* -> app/public/* 目录,我们将其放进去即可
3. 修女 nunjucks(南甲克丝)
4. Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。Controller:职责,接收数据，渲染页面， 复杂业务逻辑在service里面处理
5. 框架提供了一种快速扩展的方式，只需在 app/extend 目录下提供扩展脚本