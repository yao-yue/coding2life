//引入路由中间件
const Router = require('koa-router')
let musicRouter = new Router()
const musicController = require('../controllers/music')

musicRouter
    .post('/music/add', musicController.addMusic)
    .put('/music/update-music', musicController.updateMusic)
    .delete('/music/del-music', musicController.deleteMusic)
    .get('/music/index', musicController.showIndex)
    .get('/music/add', async ctx => {
        ctx.render('add');
    })
    .get('/music/edit', musicController.showEdit);


module.exports = musicRouter
