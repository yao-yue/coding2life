const Koa = require('koa')
let app = new Koa()
const bodyParser = require('koa-bodyparser')()
const session = require('koa-session')
const formidable = require('koa-formidable');


//引入router
const musicRouter = require('./routes/music')
const userRouter = require('./routes/user')

//配置引入
const { appPort } = require('./utils/dbConfig')
const { viewDir, staticDir,uploadDir } = require('./utils/comConfig')

app.listen(appPort, () => {
    console.log(`server running at port:${appPort} `)
})

//模板渲染
const render = require('koa-art-template')
render(app, {
    //开发的配置  debug: true  不压缩混淆/实时读取文件，静态内容及时得到更新
    debug: process.env.NODE_ENV !== 'production',
    extname: '.html',
    root: viewDir
})


//使用中间件  app.use

// 优雅的处理异常
let rewriteUrl = require('./middleware/rewrite')
let error = require('./middleware/error')
app.use(error());
// 为了给static重写URL 和首页重写url
app.use(rewriteUrl(require('./utils/rewriteUrlConfig')));

//处理静态资源
app.use(require('koa-static')(staticDir));

// 处理session
let store = {
  storage:{},
  set(key,session) {
    this.storage[key] = session;
  },
  get(key){
    return this.storage[key];
  },
  destroy(key){
    delete this.storage[key];
  }
}
app.keys = ['test']; // 基于test字符串进行签名的运算，为的是保证数据不被串改，类似加密串把
app.use(session({store:store},app))

/* 处理请求体 bodyParser引入的时候执行一下 require('koa-bodyparser')()*/
app.use(bodyParser)

/**
 * 注意这里: 1:最初使用formidable接收文件，但是头是键值对的头，
 * 所以formidable帮我们将数据解析键值对了，打印出来数据非常多
 * 2:使用bodyParser的时候，仍然是键值对的头，他解析的时候，里面包含文件，所以报错 too large  请求体太大
 */

// 处理文件及字符串
app.use(formidable({
    // 设置上传目录，否则在用户的temp目录下
    uploadDir:uploadDir,
    // 默认根据文件算法生成hash字符串（文件名），无后缀
    keepExtensions:true
  }));

app.use(musicRouter.routes())
app.use(userRouter.routes())

//处理405方法不匹配  501方法未实现
app.use(userRouter.allowedMethods())