// pages/share/index.js
Page({
  data: {
    shareUserId:'',
    shareType:1,  // 1 领取     2 去分享
    orderId:'',
  },
  onLoad: function (options) {
    this.data.orderId = options.orderId ? options.orderId:'';
    if (options.shareUserId){
      this.data.shareUserId = options.shareUserId ? options.shareUserId : '';
      this.setData({
        shareType:1
      })
    }
    else{
      this.setData({
        shareType:2
      })
    }
    
  },
  linkTo(){
    wx.navigateTo({
      url: '../register/index?shareUserId=' + this.data.shareUserId + '&orderId=' + this.data.orderId,
    })
  },
  onShareAppMessage: function (res) {
    let shareUserId = wx.getStorageSync('userId');
    if (res.from === 'button') {
      console.log(res.target);
    }
    return {
      title: '驴道房车',
      path: '/pages/share/index?shareUserId=' + shareUserId + '&orderId=' + this.data.orderId,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  }
})