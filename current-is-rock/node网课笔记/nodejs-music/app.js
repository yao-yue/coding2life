const Koa = require('koa')
const path = require('path')
let app = new Koa()

//引入router
const musicRouter = require('./routes/music')
const userRouter = require('./routes/user')

app.listen(8888, () => {
    console.log('server running at port:8888 ')
})

//模板渲染
const render = require('koa-art-template')
render(app, {
    //开发的配置  debug: true  不压缩混淆/实时读取文件，静态内容及时得到更新
    debug: process.env.NODE_ENV !== 'production',
    extname: '.html',
    root: path.join(__dirname, 'views')
}) 




//使用中间件

//为了给static重写URL
app.use(async (ctx, next) => {
    if(ctx.url.startsWith('/public')) {
        //重写URL
        ctx.url = ctx.url.replace('/public','')
    }
    //放行
    await next()
})

//处理静态资源
app.use(require('koa-static')(path.resolve('./public')))

app.use(musicRouter.routes())
app.use(userRouter.routes())

//处理405方法不匹配  501方法未实现
app.use(userRouter.allowedMethods())