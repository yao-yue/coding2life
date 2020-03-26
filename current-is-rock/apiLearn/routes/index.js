var express = require('express');
var router = express.Router();
var js = require('../controllers/jsController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });


router.get('/book/getJsBook', js.getJs)


module.exports = router;
