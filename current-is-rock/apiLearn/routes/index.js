var express = require('express');
var router = express.Router();
var js = require('../controllers/jsController')

/* GET home page. */
router.get('/', js.getJs)


module.exports = router;
