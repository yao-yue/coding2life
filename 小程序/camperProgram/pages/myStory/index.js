// pages/myStory/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    userId:'',
  },
  onLoad: function (options) {
    this.data.userId = wx.getStorageSync('userId');
    this.getList();
  },
  getList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let url = API.URL.CAR.FINDINFOMSGBYPAGE;
    let param = {
      pageIndex: this.data.pageIndex,
      pageSize: 10,
      userId: this.data.userId
    }
    util.http({
      url: url,
      dataForm: param,
      success: ({ data }) => {
        let dataList = this.data.dataList.concat(data.bussData);
        dataList.forEach((item) => {
          if (item.msgCity.length && item.msgCity.length > 4) {
            item.msgCity = item.msgCity.charAt(0) + item.msgCity.charAt(1) + item.msgCity.charAt(2) + item.msgCity.charAt(4) + '...';
          }
        })
        this.setData({
          dataList,
          pageCount: data.pageCount
        })
        wx.hideLoading();
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getList();
      }
    })
  },
  onReachBottom() {
    if (this.data.pageCount <= this.data.pageIndex) {
      this.setData({
        noMoreShow: true
      });
      return false;
    }
    this.data.pageIndex++;
    this.getList();
  },
  linkToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../storyDetail/index?id=${id}`
    })
  },
  deleteConfirm(index,id){
    let url = API.URL.CAR.DELETEINFOMSG;
    util.http({
      url: url,
      dataForm: {
        msgId: id,
      },
      success: (res) => {
        if (res.status == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
          let dataList = this.data.dataList;
          dataList.splice(index, 1);
          this.setData({
            dataList
          })
        }
        else {
          wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 2000 });
        }
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  deleteStory(e){
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content:'您真的要删除此故事吗?',
      confirmText: '确认',
      cancelText: '取消',
      showCancel: true,
      success: (res)=>{
        if (res.confirm) {
          this.deleteConfirm(index, id);
        }
      }
    })
    
  },
  onShareAppMessage: function () {

  }
})