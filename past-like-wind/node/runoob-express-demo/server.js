var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据
//文件上传常用的
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//这里的上传文件目录可以适当的根据需求修改
app.use(multer({ dest: '/tmp/'}).array('image')); 

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
 

/* <form action="http://127.0.0.1:8081/process_get" method="GET"> */
// 来对应这个表单提交的结果
app.get('/process_get', function (req, res) {
   // 输出 JSON 格式
   var response = {
       "first_name":req.query.first_name,
       "last_name":req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

/* <form action="http://127.0.0.1:8081/process_post" method="POST"> */
// 对应post
app.post('/process_post', urlencodedParser, function (req, res) {
   // 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

/**文件上传对应得 */
app.post('/file_upload', function (req, res) {
   console.log(req.files[0]);  // 上传的文件信息
   var des_file = __dirname + "/" + req.files[0].originalname;
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})
 
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})