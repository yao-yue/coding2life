var mysql = require('mysql')
var connection = mysql.createConnection({
    host: '182.92.184.154',
    user: 'redqueen',
    password: 'iGtsAmc4zpfKm5NN',
    database: 'book-shelf'
})
// console.log(connection)


connection.query('SELECT * FROM history',function(err,res,fields) {
    if(err) throw err;
    console.table(res)
})

connection.end()