// pages/changeStyle/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    style:'',
  },
  onLoad: function (options) {
    let style = wx.getStorageSync('style') ? wx.getStorageSync('style'):"normal";
    this.setData({style});
  },
  changeStyle(e){
    let style = e.currentTarget.dataset.style;
    this.setData({style})
  },
  saveStyle(){
    wx.setStorageSync('style', this.data.style);
    wx.showToast({
      title: '保存成功',
      icon:'success',
      duration:2000
    });
    setTimeout(()=>{
      wx.switchTab({
        url: `../index/index?style=${this.data.style}`,
      })
    },2000)
  }
})