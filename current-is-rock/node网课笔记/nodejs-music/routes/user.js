//引入路由中间件
const Router = require('koa-router')
let userRouter = new Router()

let {userController,checkUsername} = require('../controllers/user')

userRouter.get('/user/register', userController.showRegister)
.post('/user/check-username', userController.checkUsername )
.get('/user/login', async ctx=> {
    ctx.render('login')
})

module.exports = userRouter

