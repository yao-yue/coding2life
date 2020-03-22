// pages/register/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    mobile: '',
    code:'',
    password:'',
    btnText: '获取验证码',
    btnClick: true,
    validCode: true,
    shareUserId:'',
    orderId:'',
    isAgree:false,
  },
  onLoad: function (options) {
    this.data.shareUserId = options.shareUserId ? options.shareUserId:'';
    this.data.orderId = options.orderId ? options.orderId : '';
  },
  mobileBind(e) { this.setData({ mobile: e.detail.value }); },
  codeBind(e) { this.setData({ code: e.detail.value }); },
  passwordBind(e) { this.setData({ password: e.detail.value }); },
  clearMobile() { this.setData({ mobile: '' }); },
  clearCode() { this.setData({ code: '' }); },
  clearPassword() { this.setData({ password: '' }); },
  changeAgreeStatus(){
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  linkToAgreement(){
    wx.navigateTo({
      url: '../agreement/index',
    })
  },
  sendCode() {
    if (!this.data.mobile) {
      wx.showToast({ title: '请输入手机号', image: '../../images/warn.png', duration: 1000 }); return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      wx.showToast({ title: '手机号不合法', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (this.data.validCode) {
      this.data.validCode = false;
      this.getCode();
    }
  },
  getCode() {
    let url = API.URL.WX.FINDMOBILECODE;
    util.http({
      url: url,
      dataForm: {
        mobile: this.data.mobile,
        bizType: 'register'
      },
      success: ({ data: { bussData } }) => {
        // 发送验证码成功
        wx.showToast({
          title: '已发送至手机',
          icon: 'success',
          duration: 1000
        })
        let time = 60;
        let timer = setInterval(() => {
          time--;
          this.setData({
            btnText: time + 's后再次获取'
          })
          if (time == 0) {
            clearInterval(timer);
            this.setData({
              btnText: '重新获取'
            })
            this.data.validCode = true;
          }
        }, 1000);
      },
      fail: (res) => {
        console.log(res);
        this.dialogShow(res.msg);
        this.data.validCode = true;
      },
      revertBack: () => {
        this.getCode();
      }
    })
  },
  submit() {
    if (!this.data.btnClick){ return false;}
    if (!this.data.mobile) {
      this.dialogShow('手机号不能为空')
      return;
    }
    if (!this.data.code) {
      this.dialogShow('验证码不能为空')
      return;
    }
    if (!this.data.password) {
      this.dialogShow('密码不能为空')
      return;
    }
    if (!this.data.isAgree) {
      this.dialogShow('请先勾选用户协议')
      return;
    }
    this.data.btnClick = false;
    let url = API.URL.WX.REGISTER;
    let param = {
      openId: wx.getStorageSync('openId'),
      mobile: this.data.mobile,
      password: this.data.password,
      code: this.data.code,
    }
    if (this.data.shareUserId){
      param.shareUserId = this.data.shareUserId;
    }
    if (this.data.orderId) {
      param.orderId = this.data.orderId;
    }
    util.http({
      url: url,
      data: param,
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../login/index'
          })
        }, 1500)
      },
      fail: (res) => {
        this.dialogShow(res.msg)
      },
      revertBack: () => {
        this.registerBtn();
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