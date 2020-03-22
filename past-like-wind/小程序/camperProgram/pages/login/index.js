// pages/login/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    dialogText: '',
    openId: '',
    mobile:'',
    password:'',
    btnClick:true,
  },
  onLoad: function (options) {
    this.setData({
      mobile: wx.getStorageSync('mobile') ? wx.getStorageSync('mobile') : '',
      password: wx.getStorageSync('password') ? wx.getStorageSync('password') : ''
    })
  },
  mobileBind(e){
    this.setData({ mobile:e.detail.value });
  },
  passwordBind(e) {
    this.setData({ password: e.detail.value });
  },
  clearMobile(){
    this.setData({ mobile: '' });
  },
  clearPassword(){
    this.setData({ password: '' });
  },
  linkTo(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `../${url}/index`
    })
  },
  formSubmit(e){
    console.log(e.detail.formId);
    let formId = e.detail.formId;
    let url = API.URL.WX.UPLOADFORMID;
    util.http({
      url: url,
      dataForm: {
        formId:formId,
      },
      success: ({ data: { bussData } }) => {
        console.log(data);
        console.log('提交formId成功');
      },
      fail: (res) => {
        console.log('提交formId失败');
      },
      revertBack: () => {
        this.formSubmit();
      }
    })
    this.login();
  },
  login() {
    if (!this.data.mobile) { this.dialogShow('账号不能为空');return;}
    if (!this.data.password) {this.dialogShow('密码不能为空');return;}
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    let url = API.URL.WX.LOGINBINDING;
    util.http({
      url: url,
      data: {
        openId: wx.getStorageSync('openId'),
        mobile: this.data.mobile,
        password: this.data.password
      },
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.setStorageSync('mobile', this.data.mobile)
        wx.setStorageSync('password', this.data.password)
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        wx.setStorageSync('sessionId', bussData.sessionId)
        wx.setStorageSync('userId', bussData.userId)
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1000)
      },
      fail: (res) => {
        this.data.btnClick = true;
        this.dialogShow(res.msg)
      },
      revertBack: () => {
        this.login();
      }
    })
  },
  //弹出框
  dialogShow: function (text) {
    this.setData({
      dialogText: text
    })
    wx.hideLoading()
    setTimeout(() => {
      this.setData({
        dialogText: ''
      })
    }, 2000)
  },
})