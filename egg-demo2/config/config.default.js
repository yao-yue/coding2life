// exports 是 module.exports 的简写

exports.keys = 'ripple_secure';


exports.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
}


exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news/firebaseio.com/v0'
}




// add midlleware robot
exports.middleware = [
  'robot'
];
//robot's configurations 
exports.robots = {
  ua: [
    /curl/i,
    /Baiduspider/i,
  ]
}