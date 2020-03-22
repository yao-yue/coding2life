// pages/subleaseAuditStatus/index.jsconst 
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    status: '1',
    isAuth:'',
  },
  onLoad(){
    this.getCheckStatus();
  },
  linkTo(e){
    wx.navigateTo({
      url: '../subleaseAuditSave/index'
    })
  },
  getCheckStatus() {
    let url = API.URL.USERAUTH.FINDAUTH
      util.http({
      url: url,
      success: ({ data }) => {
        console.log(data.bussData);
        let isAuth = data.bussData.authStatus;
        if (isAuth == 'y') {
          wx.navigateTo({
            url: '/pages/mySubleaseList/index',
          })
        }
        this.setData({
          isAuth
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
})