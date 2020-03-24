//引入路由中间件
const Router = require('koa-router')
let musicRouter = new Router()

musicRouter.get('/music/index', async => {
    ctx.render('index')
})
.get('/music/add', async ctx=> {
    ctx.render('add')
})
.get('/music/edit', async ctx=> {
    ctx.render('edit')
})

module.exports = musicRouter
