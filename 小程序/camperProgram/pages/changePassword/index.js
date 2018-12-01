// pages/changePassword/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
    dialogText: '',
    btnClick: true,
  },
  pwdBind(e) {
    this.data.oldPwd = e.detail.value
  },
  pwdBind1(e) {
    this.data.newPwd = e.detail.value
  },
  pwdBind2(e) {
    this.data.confirmPwd = e.detail.value
  },
  //弹出框
  dialogShow: function (text) {
    this.setData({
      dialogText: text
    })
    setTimeout(() => {
      this.setData({
        dialogText: ''
      })
    }, 2000)
  },
  submit() {
    if (!this.data.oldPwd) {
      this.dialogShow('原密码不能为空')
      return;
    }
    if (!this.data.newPwd) {
      this.dialogShow('新密码不能为空')
      return;
    }
    if (!this.data.confirmPwd) {
      this.dialogShow('确认密码不能为空')
      return;
    }
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    let url = API.URL.USERPRODUCT.MODIFYPWD;
    util.http({
      url: url,
      data: {
        oldPwd: this.data.oldPwd,
        newPwd: this.data.newPwd,
        confirmPwd: this.data.confirmPwd
      },
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.removeStorageSync('sessionId')
          wx.redirectTo({
            url: '../login/index'
          })
        }, 1000)
      },
      fail: (res) => {
        wx.hideLoading()
        this.data.btnClick = true;
        this.dialogShow(res.msg)
      },
      revertBack: () => {
        wx.redirectTo({
          url: '../login/index'
        })
      }
    })
  },
})