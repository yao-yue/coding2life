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
        
    },
    doLogin: async (ctx, next) => {
        //1.接收对应的参数
        let {username, password} = ctx.request.body
        //2.查询用户名相关的用户
        let users = await userModel.findUserDataByUsername(username)
        //3.对比密码是否一致
        if(username.length === 0) {
            ctx.body = {
                code: '002',msg: '用户名或密码不正确',
            }
            return 
        }
        let user = users[0];
        if(user.password === password) {
            ctx.body = {
                code: '001',
                msg: '登录成功'
            }
            //挂在session用于用户认证判断
            ctx.session.user = user
            return
        }
        ctx.body = {code: '002', msg:'用户名或密码不正确'}
    }
}