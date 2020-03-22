// pages/resetMobile/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    mobile: '',
    code:'',
    newPwd:'',
    confirmPwd:'',
    btnText: '获取验证码',
    btnClick: true,
    isSame: true,
    validCode: true,
  },
  mobileBind(e) { this.setData({ mobile: e.detail.value }); },
  codeBind(e) { this.setData({ code: e.detail.value }); },
  newPwdBind(e) { this.setData({ newPwd: e.detail.value }); },
  confirmPwdBind(e) {
    let value = e.detail.value;
    if (value != this.data.newPwd) {
      this.setData({
        confirmPwd: value,
        isSame: false
      })
    }
    else {
      this.setData({
        confirmPwd: value,
        isSame: true
      })
    }
  },
  clearMobile() { this.setData({ mobile: '' }); },
  clearCode() { this.setData({ code: '' }); },
  clearNewPwd() { this.setData({ newPwd: '' }); },
  clearConfirmPwd() { this.setData({ confirmPwd: '' }); },
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
    }
  },
  getCode() {
    let url = API.URL.WX.FINDMOBILECODE;
    util.http({
      url: url,
      dataForm: {
        mobile: this.data.mobile,
        bizType: 'find_pwd'
      },
      success: ({ data: { bussData } }) => {
      },
      fail: (res) => {
        this.dialogShow(res.msg)
      },
      revertBack: () => {
        this.getCode();
      }
    })
  },
  save() {
    if (!this.data.mobile) {
      wx.showToast({ title: '请输入手机号', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      wx.showToast({ title: '手机号不合法', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (!this.data.code) {
      wx.showToast({ title: '请输入验证码', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (!this.data.newPwd) {
      wx.showToast({ title: '请输入密码', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (!this.data.confirmPwd) {
      wx.showToast({ title: '请确认密码', image: '../../images/warn.png', duration: 1000 });
      return;
    }
    if (this.data.confirmPwd != this.data.newPwd) {
      this.setData({
        isSame: false
      })
      return;
    }
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    let url = API.URL.WX.FINDPWD;
    util.http({
      url: url,
      data: {
        mobile: this.data.mobile,
        code: this.data.code,
        newPwd: this.data.newPwd,
        confirmPwd: this.data.confirmPwd
      },
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.showToast({
          title: '重置成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }, 1000)
      },
      fail: (res) => {
        this.data.btnClick = true;
        this.dialogShow(res.msg)
      },
      revertBack: () => {
        this.save();
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