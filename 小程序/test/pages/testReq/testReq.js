// pages/testReq/testReq.js
Page({

  data: {

  },
  onLoad: function (options) {
    wx.request({
      url: 'http://visney.icebartech.com/api/mini/product/findCategory',
      method: 'POST',
      data: {
        a :'1'
      },
      success(res) {
        console.log(res.data)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
})