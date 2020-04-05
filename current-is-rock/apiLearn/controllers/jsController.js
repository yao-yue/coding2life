var db = require('../utils/dbconfig')

getJs = (req, res) => {
    var sql = 'select * from js'
    var sqlArr = []
    var callBack = (err, data) => {
        if(err) {
            console.log('connect error')
        } else {
            res.set('Access-Control-Allow-Origin', '*')
            console.log('跨域？')
            res.send({
                'list': data
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack)
}



module.exports = {
    getJs
}