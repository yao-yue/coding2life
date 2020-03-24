//引入路由中间件
const Router = require('koa-router')
let userRouter = new Router()

let userController = require('../controllers/user')

userRouter.get('/user/register', userController.showRegister)
.post('/user/check-username', userController.checkUsername )
.post('/user/do-register',userController.doRegister)
.get('/user/login', async ctx=> {
    ctx.render('login')
})

module.exports = userRouter

