// pages/setting/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    
  },
  linkTo(){
    wx.navigateTo({
      url: '../changePassword/index',
    })
  },
  linkToStyle() {
    wx.navigateTo({
      url: '../changeStyle/index',
    })
  },
  loginOut(){
    wx.removeStorageSync('sessionId');
    wx.removeStorageSync('userId');
    wx.navigateTo({
      url: '../login/index'
    })
  }
 
})