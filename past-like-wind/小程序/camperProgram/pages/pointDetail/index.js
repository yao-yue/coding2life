// pages/pointDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    detailList: [],
    loadLock: false,
    noMoreShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPointDetail(1);
  },

  getPointDetail(page) {
    let url = API.URL.POINT.FINDBALACNEPAGE,
        param = {
          pageIndex: page,
          pageSize: 10,
          pointType: 'spendable'
        }
    util.http({
      url: url,
      dataForm: param,
      // data:{
       
      // },
      success: (res) => {
        let resData = res.data.bussData;
        if (page == 1) {
          var detailList = resData
        } else if (page >= 1) {
          var detailList = this.data.detailList.concat(resData);
        }
        if (page > 1 && !resData.length) {
          this.setData({
            loadLock: true,
            noMoreShow:true
          })
        }
        detailList.forEach((item)=>{
          item.operateBalance = item.operateBalance.toFixed(2);
        })
        this.setData({
          detailList
        });
        console.log(resData);
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },

  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page,
       lock = this.data.loadLock;
    if (!lock) {
      page = page + 1;
      this.setData({
        page
      })
      this.getPointDetail(page);

    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})