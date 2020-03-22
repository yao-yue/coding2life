// pages/myOrder/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    tabList:[
      { name: '线路', isActive: true, ordertype:'line_product' },
      { name: '酒店', isActive: false, ordertype: 'hotel_product'},
      { name: '营位', isActive: false, ordertype: 'campbase_product'},
      { name: '房车', isActive: false, ordertype: 'rv_rent'},
    ],
    orderType: 'line_product', // 0 line_product 路线 ， 1  hotel_product 酒店 ， 2 campbase_product 营位 ， 3 rv_rent 房车 
    orderTypeFormat:{
      'line_product': '路线',
      'hotel_product': '酒店',
      'campbase_product': '营位',
      'rv_rent': '房车',
    },
     // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    scrollShow: false,
    status:{
      wait_pay: '未支付',
      cancel_user: '已取消',
      cancel_admin: '已取消',
      cancel_timeout: '已取消',
      unfinished: '未完成',
      finished: '已完成',
    }
     
  },
  onLoad: function (options) {
    if(options.orderType){
      let index = 0;
      if (options.orderType == 'hotel_product'){index = 1;}
      else if (options.orderType == 'campbase_product') {index = 2;}
      else if (options.orderType == 'rv_rent') {index = 3;}
      let tabList = this.data.tabList;
      tabList.forEach((item) => {
        item.isActive = false;
      })
      tabList[index].isActive = true;
      this.setData({
        tabList,
        orderType: options.orderType,
        noMoreShow: false,
      });
    }
  },
  onShow: function (options) {
    this.setData({
      ageIndex: 1,
      pageCount: 0,
      dataList: [],
    });
    this.getList(this.data.orderType);
    
  },
  switchTab(e){
    let index = e.currentTarget.dataset.index;
    let orderType = e.currentTarget.dataset.ordertype;
    this.refresh(index, orderType)
  },
  refresh(index,orderType){
    let tabList = this.data.tabList;
    tabList.forEach((item) => {
      item.isActive = false;
    })
    tabList[index].isActive = true;
    this.setData({
      tabList,
      orderType: orderType,
      noMoreShow: false,
      pageIndex: 1,
      pageCount: 0,
      dataList: [],
    });
    this.getList(orderType);
  },
  getList(orderType) {
    wx.showLoading({
      title: '加载中...',
      mask:true,
    })
    let url = API.URL.ORDER.FINDORDERPAGE;
    let statusList = ['wait_pay', 'pay'];
    util.http({
      url: url,
      dataForm: {
        pageIndex: this.data.pageIndex,
        pageSize: 10,
        orderType: orderType,
        statusList: statusList
      },
      success: ({ data }) => {
        wx.hideLoading();
        let dataList = this.data.dataList.concat(data.bussData);
        dataList.forEach((item)=>{
          item.bookStartDate = item.bookStartDate ? item.bookStartDate.split('00:00:00')[0]:'';
          item.bookEndDate = item.bookEndDate ? item.bookEndDate.split('00:00:00')[0] : '';
          item.totalPrice = item.totalPrice.toFixed(2);
        });
        this.setData({
          dataList:dataList,
          pageCount: data.pageCount
        })
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  //确认完成
  confirmDone(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      content: ' 确认完成此订单吗？',
      success: (res) => {
        if (res.confirm) {
          let url = API.URL.ORDER.UPDATESTATUS;
          util.http({
            url: url,
            dataForm: {
              orderId: id,
              status: 'finished'
            },
            success: (res) => {
              if(res.status == 200){
                wx.showToast({
                  title: '确认成功',
                  icon: 'success',
                  duration: 2000
                })
                let dataList = this.data.dataList;
                dataList[index].realStatus = 'finished';
                this.setData({ dataList });
              }
              else{
                wx.showToast({
                  title: res.msg,
                  duration: 1500,
                  image: '../../images/fail.png'
                })
              }
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
  //取消订单
  cancelOrder(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      content: '确认取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          let url = API.URL.ORDER.CANCELORDER;
          util.http({
            url: url,
            dataForm: {
              orderId: id
            },
            success: (res) => {
              if (res.status == 200) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000
                })
                let dataList = this.data.dataList;
                dataList[index].realStatus = 'cancel_user';
                this.setData({ dataList });
              }
              else {
                wx.showToast({
                  title: res.msg,
                  duration: 1500,
                  image: '../../images/fail.png'
                })
              }
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
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../comment/index?orderId=${orderId}&orderType=${this.data.orderType}`
    })
  },
  confirmPay(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../orderDetail/index?orderId=${orderId}&orderType=${this.data.orderType}&actionStatus=pay`
    })
  },
  onReachBottom() {
    if (this.data.scrollShow) return;
    if (this.data.pageCount <= this.data.pageIndex) {
      this.setData({
        noMoreShow: true
      });
      return false;
    }
    this.data.pageIndex++;
    this.data.scrollShow = false;
    this.getList(this.data.orderType);
  },
  linkTo(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../orderDetail/index?orderId=${id}&orderType=${this.data.orderType}`
    })
  }
})