const Koa = require('koa')
let app = new Koa()
const bodyParser = require('koa-bodyparser')()

//引入router
const musicRouter = require('./routes/music')
const userRouter = require('./routes/user')

//配置引入
const { appPort } = require('./utils/dbConfig')
const { viewDir, staticDir } = require('./utils/comConfig')

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

//优雅的处理异常
// app.use(async (ctx, next) => {
//     try {
//         //先放行
//         await next()
//     } catch (error) {
//         //根据controllers里面抛出来的异常来进行捕获处理
//         ctx.render('error', {msg: '002状态错误，原因是：xxx'})
//     }

// })

//为了给static重写URL
app.use(async (ctx, next) => {
    if (ctx.url.startsWith('/public')) {
        //重写URL
        ctx.url = ctx.url.replace('/public', '')
    }
    //放行
    await next()
})

//处理静态资源
app.use(require('koa-static')(staticDir))

/* 处理请求体 bodyParser引入的时候执行一下 require('koa-bodyparser')()*/
app.use(bodyParser)

app.use(musicRouter.routes())
app.use(userRouter.routes())

//处理405方法不匹配  501方法未实现
app.use(userRouter.allowedMethods())