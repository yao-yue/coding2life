function random2(min, max) {
    return Math.floor(Math.random()*(max-min)) + min
}
//模拟发送验证码的操作

sendCode = (req, res) => {
    let phone = req.body.user_phone
    let code = random2(1000,9999)
    res.send({
        code:200,
        msg: 'success'
    })
    console.log(code)
}

// signIn = (req, res) => {
//     let {username,password }= req.body
//      // Cookies that have not been signed
//     // console.log('Cookies: ', req.cookies)
//     ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080')
//     ctx.set('Access-Control-Allow-Credentials', true)
//     // 非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）
//     // 这种情况下除了设置origin，还需要设置Access-Control-Request-Method以及Access-Control-Request-Headers
//     ctx.set('Access-Control-Request-Method', 'PUT,POST,GET,DELETE,OPTIONS')
//     ctx.cookies.set('tokenId', '2')

//     ctx.body = successBody({msg: query.msg}, 'success')
// }

module.exports = {
    sendCode,
}