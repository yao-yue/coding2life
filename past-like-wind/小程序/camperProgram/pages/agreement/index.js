// pages/agreement/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    tip:'',
  },
  onLoad: function (options) {
    this.getTip();
  },
  getTip() {
    let url = API.URL.ADV.FINDREGISTERTIP;
    util.http({
      url: url,
      success: ({ data }) => {
        var that = this;
        WxParse.wxParse('article', 'html', data.bussData.varValue, that, 10);
        // this.setData({
        //   tip: data.bussData.varValue
        // })
      },
      fail: (res) => {
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
})