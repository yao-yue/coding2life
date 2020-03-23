var express = require('express');
var router = express.Router();
var User = require('../controllers/UserController')

/* GET users listing. */
router.post('/sendCode', User.sendCode);

module.exports = router;
