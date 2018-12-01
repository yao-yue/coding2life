// pages/orderDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderType:'',
    actionStatus:'',
    status: {
      wait_pay: '未支付',
      cancel_user: '已取消',
      cancel_admin: '已取消',
      cancel_timeout: '已取消',
      unfinished: '未完成',
      finished: '已完成',
    },
    detailInfo:{},
    days:'',
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      orderType:options.orderType,
    })
    let actionStatus = options.actionStatus ? options.actionStatus:'';
    if (actionStatus && actionStatus == "pay"){
      // 跳出支付弹窗
    }
    this.getDetail(options.orderId);
  },
  getDetail(orderId) {
    let url = API.URL.ORDER.FINDORDERBYID;
    util.http({
      url: url,
      dataForm: {
        orderId: orderId
      },
      success: ({ data: { bussData } }) => {
        console.log(bussData);
        // this.setData({
        //   detailInfo:bussData
        // })
        
        let bookStartDate = bussData.bookStartDate ? bussData.bookStartDate.split(' ')[0] : '';
        let bookEndDate = bussData.bookEndDate ? bussData.bookEndDate.split(' ')[0] : '';
        let startTravelDate = bussData.startTravelDate ? bussData.startTravelDate.split(' ')[0] : '';
        console.log(bookStartDate);
        let day = 0;
        if (bussData.bookStartDate){
          let end = new Date(bookEndDate).getTime()
          let start = new Date(bookStartDate).getTime()
          day = parseInt((end - start) / (1000 * 60 * 60 * 24));
        }
        bussData.bookStartDate = bookStartDate;
        bussData.bookEndDate = bookEndDate;
        bussData.startTravelDate = startTravelDate;
        bussData.totalPrice = bussData.totalPrice.toFixed(2);
        bussData.spendablePointPrice = bussData.spendablePointPrice.toFixed(2);
        bussData.payPrice = parseFloat((bussData.totalPrice + bussData.spendablePointPrice)).toFixed(2);
        this.setData({
          detailInfo: bussData,
          days: day
        })
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
  //取消订单
  cancelOrder(e) {
    wx.showModal({
      content: '是否取消订单',
      success: (res) => {
        if (res.confirm) {
          let url = API.URL.ORDER.CANCELORDER;
          util.http({
            url: url,
            dataForm: {
              orderId: this.data.detailInfo.orderId
            },
            success: ({ data }) => {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              this.getDetail(this.data.detailInfo.orderId)
            },
            fail: (res) => {
              wx.showToast({
                title: res.msg,
                duration: 1500,
                image: '../../images/fail.png'
              })
            },
            revertBack: () => {
              wx.reLaunch({
                url: '../login/index'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //确认完成
  confirmDone() {
    wx.showModal({
      content: '是否确认完成',
      success: (res) => {
        if (res.confirm) {
          let url = API.URL.ORDER.UPDATESTATUS;
          util.http({
            url: url,
            dataForm: {
              orderId: this.data.detailInfo.orderId,
              status: 'finished'
            },
            success: ({ data }) => {
              wx.showToast({
                title: '确认成功',
                icon: 'success',
                duration: 2000
              })
              this.getDetail(this.data.detailInfo.orderId)
            },
            fail: (res) => {
              wx.showToast({
                title: res.msg,
                duration: 1500,
                image: '../../images/fail.png'
              })
            },
            revertBack: () => {
              wx.reLaunch({
                url: '../login/index'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  confirmComment(e) {
    wx.navigateTo({
      url: `../comment/index?orderId=${this.data.orderId}&orderType=${this.data.orderType}`
    })
  },
  submitPay(){
    util.http({
      url: API.URL.SYS.REPAY,
      dataForm: {
        orderId: this.data.detailInfo.orderId
      },
      success: (data) => {
        this.payRequest(data.data.bussData)
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: res.msg,
          duration: 1500,
          image: '../../images/fail.png'
        })
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  //小程序支付
  payRequest(item) {
    wx.requestPayment(
      {
        'timeStamp': item.timestamp,
        'nonceStr': item.noncestr,
        'package': item.packageDesc,
        'signType': item.signType,
        'paySign': item.sign,
        'success': (res) => {
          this.getDetail(this.data.detailInfo.orderId)
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付取消',
            duration: 1500,
            image: '../../images/fail.png'
          })
        }
      })
  },
  goToShare(e){
    // let userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../share/index?orderId=' + this.data.detailInfo.orderId
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let userId = wx.getStorageSync('userId');
    if (res.from === 'button') {
      console.log(res.target);
    }
    return {
      title: '驴道房车',
      path: '/pages/share/index?userId='+ userId,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  }
})