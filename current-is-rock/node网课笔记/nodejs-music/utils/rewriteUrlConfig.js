module.exports = [ 
    {regex:/\/abc/,dist:'/user/login'},
    {regex:/\/public(.*)/,dist:null }, // dist:null 则使用.*的内容
    {src:'/',dist:'/user/login'}
  ] 


// dist分发、分配

//exec() 方法是一个正则表达式方法。
// exec() 方法用于检索字符串中的正则表达式的匹配。
// 该函数返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。