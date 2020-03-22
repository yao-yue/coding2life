// pages/subleaseInstructions/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    tip:'',
    isAuth: false
  },

  onLoad: function (options) {
    this.getTip();
  },
  getTip(){
    let url = API.URL.ADV.FINDRERENTTIP;
      util.http({
        url: url,
        success: ({ data }) => {
          console.log(data);
          this.setData({
            tip: data.bussData.varValue
          })
        },
        fail: (res) => {
        },
        revertBack: () => {
          wx.reLaunch({
            url: '../login/index'
          })
        }
    })
  },

  linkTo(e){
    this.getCheckStatus();
    let isAuth = this.data.isAuth;
    if (isAuth == 'y') {
      wx.navigateTo({
        url: `../rentList/index`
      })
    } else {
      wx.navigateTo({
        url: `../subleaseAuditStatus/index`
      })
    }
  },
  getCheckStatus() {
    let url = API.URL.USERAUTH.FINDAUTH
    util.http({
      url: url,
      success: ({ data }) => {
       // console.log(data.bussData);
        let isAuth = data.bussData.authStatus;
        // this.setData({
        //   isAuth
        // })
        if (isAuth == 'y') {
          wx.navigateTo({
            url: `../rentList/index`
          })
        } else {
          wx.navigateTo({
            url: `../subleaseAuditStatus/index`
          })
        }
      },
      revertBack: () => {
        wx.navigateTo({
          url: '../login/index'
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})