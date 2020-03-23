var db = require('../utils/dbconfig')

getJs = (req, res) => {
    var sql = 'select * from js'
    var sqlArr = []
    var callBack = (err, data) => {
        if(err) {
            console.log('connect error')
        } else {
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