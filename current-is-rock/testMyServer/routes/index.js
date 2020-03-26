var express = require('express');
var router = express.Router();
var penController = require('../controllers/pen')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// .post('/music/add', musicController.addMusic)
// .put('/music/update-music', musicController.updateMusic)
// .delete('/music/del-music', musicController.deleteMusic)
// .get('/music/index', musicController.showIndex)
// .get('/music/add', async ctx => {
//     ctx.render('add');
// })
// .get('/music/edit', musicController.showEdit);
//for uri   pen
router.get('/pen/index',penController.showAllPen)
.get('/pen/findpen',penController.showPenById)
.put('/pen/update-pen',penController.updatePen)
.delete('/pen/del-pen',penController.deletePen)
.post('/pen/add-pen',penController.addPen)


module.exports = router;
