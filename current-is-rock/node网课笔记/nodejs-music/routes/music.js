//引入路由中间件
const Router = require('koa-router')
let musicRouter = new Router()
const musicController = require('../controllers/music')

musicRouter
    .post('/music/add', musicController.addMusic)
    .put('/music/update-music', musicController.updateMusic)
    .get('/music/index', async ctx => {
        ctx.render('index');
    })
    .get('/music/add', async ctx => {
        ctx.render('add');
    })
    .get('/music/edit', async ctx => {
        ctx.render('edit');
    });


module.exports = musicRouter
