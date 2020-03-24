//引入路由中间件
const Router = require('koa-router')

let userRouter = new Router()

userRouter.get('/user/register', async ctx=> {
    ctx.render('register')
})
.get('/user/login', async ctx=> {
    ctx.render('login')
})

module.exports = userRouter

