const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
  },
  goReq() {
    this.test()
  },

  test:  util.throttle(function (e) {
      console.log('fuck!!!!')
      // console.log(this)
      // console.log(e)
      // console.log((new Date()).getSeconds())
    }, 5000)
 
})
