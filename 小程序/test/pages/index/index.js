
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
  goReq: function() {
    wx.navigateTo({
      url: '/pages/testReq/testReq',
    })
  }
})
