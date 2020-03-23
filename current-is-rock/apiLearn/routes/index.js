var express = require('express');
var router = express.Router();
var dbConnect = require('../utils/dbconfig')

/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "select * from js"
  var sqlArr = [];
  var callBack = (err, data) => {
    if(err) {
      console.log('connect error')
    }else {
      res.send({
        'list': data
      })
    }
  }
  dbConnect.sqlConnect(sql, sqlArr, callBack)
  // res.render('index', { title: 'Express' });
});


module.exports = router;
