// pages/myCenter/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    list:[
      { name: '我的订单', icon: '../../images/myIcon_1.png', url: 'myOrder'},
      { name: '我的钱包', icon: '../../images/myIcon_2.png', url: 'myWallet' },
      { name: '我的转租', icon: '../../images/myIcon_6.png', url: 'mySubleaseList' },
      { name: '我的收益', icon: '../../images/myIcon_3.png', url: 'myProfit' },
      { name: '我的故事', icon: '../../images/myIcon_4.png', url: 'myStory' },
      { name: '我的奖品', icon: '../../images/myIcon_4.png', url: 'myAward' },
      { name: '设置', icon: '../../images/myIcon_5.png', url: 'setting' },
    ],
    detailInfo: {},
     isAuth:'n'  // 是否已经实名认证
  },
  onLoad: function (options) {
    // this.getInfo();
    // this.getCheckStatus(); 
  },
  onShow: function () {
    if (wx.getStorageSync('sessionId') && wx.getStorageSync('userId')) {  // 登录
      this.getInfo();
    }
    else {
      this.setData({
        detailInfo: {}
      })
    }
  },
  revert(){
    wx.removeStorageSync('sessionId');
    this.setData({
      detailInfo: {}
    })
  },
  linkTo(e){
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index',
      });
      return false;
    }
    let url = e.currentTarget.dataset.url;
    // let index = e.currentTarget.dataset.index ? e.currentTarget.dataset.index:'';
    // let isAuth = this.data.isAuth;
    // if (index == 2 && isAuth != 'y'){  // 转租未实名认证
    //   wx.navigateTo({
    //     url: '/pages/subleaseAuditStatus/index',
    //   })
    // }
    // else{
      wx.navigateTo({
        url: `../${url}/index`
      })
    // }
  },
  getInfo() {
    let url = API.URL.USERPRODUCT.FINDUSERDETAIL;
    util.http({
      url: url,
      success: ({ data }) => {
        this.setData({
          detailInfo: data.bussData
        })
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.revert();
        // wx.reLaunch({
        //   url: '../login/index'
        // })
      }
    })
  },
  getCheckStatus() {
    let url = API.URL.USERAUTH.FINDAUTH
    util.http({
      url: url,
      success: ({ data }) => {
        let isAuth = data.bussData.authStatus;
        this.setData({
          isAuth
        })
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.revert();
        // wx.reLaunch({
        //   url: '../login/index'
        // })
      }
    })
  },
  formSubmit(e) {
    console.log(e);
    let formId = e.detail.formId;
    let url = API.URL.WX.UPLOADFORMID;
    util.http({
      url: url,
      dataForm: {
        formId: formId,
      },
      success: ({ data: { bussData } }) => {
        console.log('提交formId成功');
      },
      fail: (res) => {
        console.log(res);
        console.log('提交formId失败');
      },
      revertBack: () => {
        this.formSubmit();
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})