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
    },
    doRegister: async (ctx, next) => {
        let { username, password, email, v_code} = ctx.request.body
        //判断用户名是否存在
        let users = await userModel.findUserByUsername(username)
        if(users.length !== 0) {
            ctx.body = {
                code: '002',
                msg: '用户名已存在'
            }
            return;
        }
        //开始注册（也可以做异常捕获）
        try {
            let res = await userModel.registerUser(username, password, email)
        // insertId rows 判断是否插入成功,再给予提示
        if(res.affectedRows === 1) {
            ctx.body = { 
                code: '001',
                msg: '注册用户成功'
            }
            return ;
        }
        //上面不为1的情况会发生在id冲突，就不插入数据
        ctx.body = { code: '002', msg: res.message}
        } catch (error) {
            //判断error的一些信息
            ctx.throw(error)
        }
        
    }
}