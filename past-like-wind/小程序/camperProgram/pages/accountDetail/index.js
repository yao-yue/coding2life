// pages/accountDetail/index.js
const API = require('../../common/constant.js');    //API的字符串接口 集合
const util = require('../../utils/util');
const app = getApp();
Page({
  data: {
    page: 1,
    currentTab: 0,
    tabList:[
      { name: '收支明细', isActive: true},
      { name: '提现记录', isActive: false}
    ],
    detailList: [],
    noMoreShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIncomeDetail(1);
  },
  switchTab(e){
    let index = e.currentTarget.dataset.index,
        currentTab = this.data.currentTab,
        tabList = this.data.tabList;
    if (index == currentTab) return
    tabList.forEach((item)=>{
      item.isActive = false;
    })
    tabList[index].isActive = true;
    this.setData({
      tabList,
      currentTab: index,
      page: 1,
      loadLock: false,
      noMoreShow:false,
    }, () => {
      if (index == 0) {
        this.getIncomeDetail(1);
      } else {
        this.getWithdrawDetail(1);
      }
    })
  },


  getIncomeDetail(page) {
    let url = API.URL.POINT.FINDBALACNEPAGE,
      param = {
        pageIndex: page,
        pageSize: 10,
        busTypeListWithout: ['withdraw','withdraw_back']
      }
    util.http({
      url: url,
      dataForm: param,
      success: (res) => {
        let resData = res.data.bussData;
        if (page == 1) {
          var detailList = resData
        } else if (page >= 1) {
          var detailList = this.data.detailList.concat(resData);
        }
        if (page >1  && !resData.length) {
          this.setData({
            loadLock: true,
            noMoreShow: true
          })
        }
        detailList.forEach((item)=>{
          item.operateBalance = parseFloat(item.operateBalance).toFixed(2);
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
  
  getWithdrawDetail (page) {
    let url = API.URL.USERPRODUCT.FINDWITHDRAWDETAIL,
      param = {
        pageIndex: page,
        pageSize: 10,
      }
    util.http({
      url: url,
      dataForm: param,
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
        detailList.forEach((item) => {
          item.withdrawPrice = parseFloat(item.withdrawPrice).toFixed(2);
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
        lock = this.data.loadLock,
        currentTab = this.data.currentTab;
    if (!lock) {
      page = page + 1;
      this.setData({
        page
      }, () => {
        if (currentTab == 0) {
          this.getIncomeDetail(page);
        } else {
          this.getWithdrawDetail(page);
        }
      });
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})