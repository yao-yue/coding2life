var express = require('express'),
    mysql = require('mysql'),
    config = require('./config')

/**
 * connect database
 */
var db = mysql.createClient(config)

app = express.createServer()

app.set('view engine', 'jade');
app.set('view', __dirname + '/views');
app.set('view options', { layout : false})

//index router

app.get('/', function(req, res, next) {
    res.render('index');
})

//pruduct route
app.post('/create', function(req, res, next) {

})

//check product route
app.get('/item/:id', function(req, res, next) {
    res.render('item')
})

//comment product route
app.post('/item/:id/review', function(req, res, next) {

})

app.listen(3000);