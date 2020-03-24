const mysql = require('mysql')
let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'loaclhost',
    port: '3306',
    user: 'redqueen',
    password: '112233',
    database: 'node_music'
})

let db = {}

db.query = function (sql, params) {
    //需要用promise做一个包裹
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err)
                return;
            }

            conn.query(sql, params, function (err, res, fields) {
                console.log(`${sql}=>${params}`);
                conn.release()
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    })
}

module.exports = db