//app.js
let CONSTANT = require('common/constant.js');
const util = require('utils/util');
App({
  onLaunch: function () {
     // this.login();
  },
  login: function (callback) {
    // wx.showLoading({ title: '登录中...' })
    let that = this;
    wx.login({//login流程
      success: (res) => {//登录成功
        if (res.code) {
          // 微信小程序登录
          console.log(res.code)
          // return;
          wx.request({
            url: CONSTANT.URL.WX.LOGIN,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            dataType: 'json',
            method: 'POST',
            success: function (res) {
              console.log(res);
              let openId = res.data.data?res.data.data.bussData.openId:'';
              wx.setStorage({
                 key: "openId",
                 data: openId
              })
              callback && callback();
              // 已授权再次执行保存用户信息，未授权去首页点击授权保存用户信息
              wx.getSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) { 
                     that.saveUserInfo(openId)
                  }
                },
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res)
        }
      }
    })
  },
  saveUserInfo(openId) {
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        let encryptedData = res.encryptedData,
            iv = res.iv;
        
        let data = {
          openId: openId,
          encryptedData: encryptedData,
          iv: iv
        }
        wx.request({
          url: CONSTANT.URL.WX.SAVE,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            body:JSON.stringify(data)
          },
          dataType: 'json',
          method: 'POST',
          success: (res) => {
            console.log('信息保存成功');
            //wx.hideLoading()
          }
        })
      },
      fail: function (res) {
        //wx.hideLoading()
        if (res.errMsg == 'getUserInfo:fail auth deny') {
          that.getAccess('小程序需要获取用户权限，点击确认前往设置');
        }
        else {
          console.log(res.errMsg);
        }
      }
    })
  },
  getAccess: function (text) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '提示',
            content: text,
            confirmText: '确认',
            cancelText: '取消',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting['scope.userInfo']) {
                      wx.showToast({ title: '开启成功', icon: 'success', duration: 1500 })
                      wx.reLaunch({ url: '../index/index' })
                    }
                    else {
                      that.getAccess('关闭授权可能会无法使用小程序部分功能，可点击确认前往重新开启设置');
                    }
                  }
                });
              }
            }
          })
        }
        else {
          console.log('已获取用户权限');
        }
      }
    })
  },
  globalData: {
    userInfo: {}
  }
})

/*
 {
        "pagePath": "pages/route/index",
        "text": "驴行社",
        "iconPath": "images/icon_2.png",
        "selectedIconPath": "images/icon_2_active.png"
      },
      {
        "pagePath": "pages/storyCircle/index",
        "text": "驴圈子",
        "iconPath": "images/icon_3.png",
        "selectedIconPath": "images/icon_3_active.png"
      },
 */