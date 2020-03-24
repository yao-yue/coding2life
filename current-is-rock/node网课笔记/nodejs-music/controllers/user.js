const userModel = require('../models/user')


module.exports = {
    showRegister: async (ctx, next) => {
        let users = await userModel.getUsers()
        console.log(users);
        ctx.render('register')
    },
    checkUsername: async (ctx, next) => {
        //处理接收请求之类的繁琐事物，不操作数据
        let {username} = ctx.request.body
        //查询数据库中是否存在该用户
        let users = await userModel.findUserByUsername(username)
        if(users.length === 0) {
            ctx.body = {
                code: '001',
                msg: '可以注册'
            }
            return;
        }
        ctx.body = {code: '002', msg:' 用户名已存在'}
    }
}