const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnText: '获取验证码',
    btnClick: true,
    validCode: true,
    dialogText: '',
    code: '',
    mobile: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  mobileBind(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeBind(e) {
    this.setData({
      code: e.detail.value
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
        bizType: 'change_mobile'
      },
      success: ({ data: { bussData } }) => {
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
        this.dialogShow(res.msg);
        this.data.validCode = true;
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  submit() {
    if (!this.data.btnClick) { return false; }
    if (!this.data.mobile) {
      this.dialogShow('手机号不能为空')
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      this.dialogShow('手机号格式不对')
      return;
    }
    if (!this.data.code) {
      this.dialogShow('验证码不能为空')
      return;
    }
    this.data.btnClick = false;
    let url = API.URL.WX.CHANGEMOBILE;
    util.http({
      url: url,
      data: {
        mobile: this.data.mobile,
        code: this.data.code
      },
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.showToast({
          title: '提交成功',
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
        this.dialogShow(res.msg);
        this.data.btnClick = true;
      },
      revertBack: () => {
        wx.navigateTo({
          url: '../login/index'
        })
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