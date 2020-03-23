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

module.exports = {
    sendCode,
}