var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'redqueen',
    password: '112233',
    database: 'book-self'
})
// console.log(connection)


connection.query('SELECT * FROM js',function(err,res,fields) {
    if(err) throw err;
    console.table( res)
})

connection.end()