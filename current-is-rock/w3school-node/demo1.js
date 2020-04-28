//服务器
const http = require('http')

function process_request(req, res) {
    const body = `
    <!DOCTYPE html>
    <html lang="len">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="http://ww1.sinaimg.cn/large/006x4mSygy1gdsg36scong303k03kq2u.gif" />
        <meta name="viewpoint" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
        <title>fuck!</title>
    </head>
        <body>
            <h1> hello world!</h1>
        </body>
    </html>
    `
    // res.writeHead(200)
    res.end(body)
}
var s = http.createServer(process_request);
s.listen(8080,() => {
    console.log('server is runing at 127.0.0.1:8080')
});