//引入路由中间件
const Router = require('koa-router')
let musicRouter = new Router()
const musicController = require('../controllers/music')

musicRouter.get('/music/index', async ctx=> {
    ctx.render('index')
})
.post('/music/add', musicController.addMusic)
.get('/music/edit', async ctx=> {
    ctx.render('edit')
})

module.exports = musicRouter
