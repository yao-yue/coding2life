// pages/hotelDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    detailInfo:{},
  },
  onLoad: function (options) {
    this.data.id = options.id ? options.id : '';
    this.getDetail();
  },
  //详情
  getDetail() {
    let url = API.URL.CAR.FINDROOMDETAILBYID;
    util.http({
      url: url,
      dataForm: {
        id: this.data.id
      },
      success: ({ data: { bussData } }) => {
        var that = this;
        WxParse.wxParse('article', 'html', bussData.contents, that, 10);
        this.setData({
          detailInfo: bussData
          // contents: bussData.productInfo.contents
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getDetail();
      }
    })
  },
  linkToConfirm(){
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    wx.navigateTo({
      url: `../confirmOrder/index?id=${this.data.id}&orderType=hotel`
    })
  },
  makeCall(e){
    let mobile = e.currentTarget.dataset.mobile;
    console.log(mobile);
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  linkToComment(e) {
    wx.navigateTo({
      url: '../commentList/index?id=' + this.data.detailInfo.id + '&productType=hotel_product'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '驴道房车',
      path: '/pages/hotelDetail/index?id=' + this.data.detailInfo.id,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },
})