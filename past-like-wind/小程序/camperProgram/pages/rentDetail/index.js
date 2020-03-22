// pages/rentDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    // 预订
    bookShow:false,
    detailInfo:{},  //房车详情
    contents:'',
    tagList: ['车内干净','驾驶很安全','很耐心']
  },
  onLoad: function (options) {
    this.data.id = options.id?options.id:'';
    this.data.encrypt = options.encrypt ? options.encrypt:'';
    if (options.id){
      this.getDetail(options.id);
    }
    else if (options.encrypt){
      this.getDetailByEncrypt(options.encrypt);
    }
  },
  submit(){
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    this.setData({
      bookShow:true
    })
  },
  cancel(){
    this.setData({
      bookShow: false
    })
  },
  linkToPage(e){
    this.setData({
      bookShow: false
    })
    let path = e.currentTarget.dataset.path;
    let leasetype = e.currentTarget.dataset.leasetype ? e.currentTarget.dataset.leasetype : '';
    let url;
    console.log(leasetype);
    if (this.data.encrypt){   // 转租 
      url = `../${path}/index?id=${this.data.detailInfo.id}&leasetype=${leasetype}&encrypt=${this.data.encrypt}`
    }
    else{
      url = `../${path}/index?id=${this.data.detailInfo.id}&leasetype=${leasetype}`
      if (leasetype == 'month') {  // 非转租 月租
        this.getCheckStatus(url);
        return false;
      }
      // else {  // 非转租 日租
      //   url = `../${path}/index?id=${this.data.detailInfo.id}&leasetype=${leasetype}`
      // }
    }
    wx.navigateTo({
       url: url
    })
  },
  getCheckStatus(linkUrl) {
    let url = API.URL.USERAUTH.FINDAUTH
    util.http({
      url: url,
      success: ({ data }) => {
        console.log(data.bussData);
        let isAuth = data.bussData.authStatus;
        if (isAuth === 'y') {  // 审核通过
          wx.navigateTo({
            url: linkUrl
          })
        }
        else if (isAuth === 'n') {  // 未提交审核
          wx.navigateTo({
            url: '../subleaseAuditSave/index'
          })
        }
        else {  // 审核中 或者 审核拒绝
          wx.navigateTo({
            url: '../subleaseAuditStatus/index',
          })
        }
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  //租赁详情
  getDetail(id) {
    let url = API.URL.CAR.FINDRENTINFOBYID;
    util.http({
      url: url,
      dataForm: {
        id: id
      },
      success: ({ data: { bussData } }) => {
        var that = this;
        WxParse.wxParse('article', 'html', bussData.productInfo.contents, that, 10);
        bussData.price = parseFloat(bussData.price).toFixed(2);
        this.setData({
          detailInfo: bussData,
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getLeaseDetail(this.data.id);
      }
    })
  },
  getDetailByEncrypt(encrypt) {
    let url = API.URL.CAR.FINDRENTINFOBYQRCODE;
    util.http({
      url: url,
      data: { encrypt: encrypt },
      success: ({ data: { bussData } }) => {
        var that = this;
        WxParse.wxParse('article', 'html', bussData.productInfo.contents, that, 10);
        this.setData({
          detailInfo: bussData,
          encrypt: bussData.encrypt,
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getLeaseDetailByEncrypt(this.data.encrypt);
      }
    })
  },
  linkToComment(e){
    wx.navigateTo({
      url: '../commentList/index?id=' + this.data.detailInfo.id + '&productType=rv_rent'
    })
  },
  makeCall(e) {
    let mobile = e.currentTarget.dataset.mobile;
    console.log(mobile);
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '驴道房车',
      path: '/pages/rentDetail/index?id=' + this.data.detailInfo.id,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },
})