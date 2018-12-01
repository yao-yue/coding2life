const api = 'http://www.easy-mock.com/mock/59e06840e2fd4e67507fc576/WX/weixin';
module.exports = {
  WX: {
     SAVE: api + 'weixin/user/saveUserInfo',
     LOGIN: api + 'weixin/user/weixinLogin'
  },
  ORDER:{
    FINDORDERBYPAGE: api + 'order/findOrderByPage',  // 分页获取订餐订单
  }
}