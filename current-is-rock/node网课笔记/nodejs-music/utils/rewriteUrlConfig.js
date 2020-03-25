module.exports = [ 
    {regex:/\/abc/,dist:'/user/login'},
    {regex:/\/public(.*)/,dist:null }, // dist:null 则使用.*的内容
    {src:'/',dist:'/user/login'}
  ] 


// dist分发、分配