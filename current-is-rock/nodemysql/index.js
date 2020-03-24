var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'redqueen',
    password: '112233',
    database: 'node_music'
})
// console.log(connection)


connection.query('SELECT * FROM users',function(err,res,fields) {
    if(err) throw err;
    console.table(res)
})

connection.end()