const mysql = require('mysql')

module.exports = {
    config: {
        host: 'localhost',
        port: '3306',
        user: 'redqueen',
        password: '112233',
        database: 'book-self'
    },
    //连接池连接方式
    sqlConnect: function(sql,sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            console.log('连接成功')
            if(err) {
                console.log('connect failed!')
                return
            }
            //事件驱动回调
            conn.query(sql,sqlArr,callBack)
            //释放连接
            conn.release()
        })
    }
}