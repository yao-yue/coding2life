const Controller = require('egg').Controller


//职责  接收数据，渲染页面， 复杂业务逻辑在service里面处理
class NewsController extends Controller {
    async list() {
        const ctx = this.ctx;
        const page = ctx.query.page || 1;
        const newsList = await ctx.service.news.list(page);
        await ctx.render('news/list.tpl', { list: newsList });
    }
}

module.exports = NewsController