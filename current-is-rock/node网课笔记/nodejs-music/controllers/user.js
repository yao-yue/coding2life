const userModel = require('../models/user')
const captchapng = require('captchapng2')

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
        //比较v_code如果不等于session中的v_code
        if(v_code !== ctx.session.v_code) {
            ctx.body = {
                code : '002', msg:'验证码不正确'
            }
            return 
        }
        
        
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
    },
    getPic: async (ctx, next) => {
        let rand = parseInt(Math.random() * 9000 + 1000)
        //区分不同用户的答案，并分配session,响应cookie
        //cookie是服务器先发过来的，然后浏览器携带着去请求服务器
        ctx.session.v_code = rand
        let png = new captchapng(80,30, rand)
        ctx.body = png.getBuffer()
    },
    async logout() {
        // 1.清除session 上user
        // 2.重定向页面到login
        ctx.session.user = null
        ctx.redirect('/user/login')
    }
}