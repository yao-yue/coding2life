// pages/storyCircle/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[
      { name: '游记', isActive: true, msgType:''},
      { name: '景点', isActive: false, msgType: 'SCENERY'},
      { name: '美食', isActive: false, msgType: 'FOOD'},
      { name: '文化', isActive: false, msgType: 'CULTURE'},
      { name: '活动', isActive: false, msgType: 'ACTIVITY'},
    ],
    msgType:'',
    // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    fresh:true,
  },
  onLoad: function (options) {
    this.getList();
  },
  onShow(){
    
  },
  switchTab(e) {
    let index = e.currentTarget.dataset.index;
    let tabList = this.data.tabList;
    tabList.forEach((item) => {
      item.isActive = false;
    })
    tabList[index].isActive = true;
    this.data.msgType = tabList[index].msgType;
    this.setData({
      msgType: this.data.msgType ,
      tabList,
      pageIndex: 1,
      pageCount: 0,
      dataList: [],
      noMoreShow: false,
    });
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
      pageSize:6,
    }
    if(this.data.msgType){
      param.msgType = this.data.msgType;
      param.status = 'off';
    }
    else{
      param.status = 'on';
    }
    util.http({
      url: url,
      dataForm: param,
      success: ({ data }) => {
        let dataList = this.data.dataList.concat(data.bussData);
        dataList.forEach((item)=>{
          if (item.msgCity.length && item.msgCity.length >4 ){
            item.msgCity = item.msgCity.charAt(0) + item.msgCity.charAt(1) + item.msgCity.charAt(2) + item.msgCity.charAt(4)+'...';
          }
        })
        this.setData({
          dataList,
          pageCount: data.pageCount
        })
        wx.hideLoading();
        this.data.fresh = true;
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
  linkTo(e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: `../storyDetail/index?id=${id}&status=${status}`
    })
  },
  linkToSearch() {
    wx.navigateTo({
       url: `../search/index?fromPage=storySort`
    })
  },
  linkToEdit(){
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index',
      });
      return false;
    }
    wx.navigateTo({
      url: `../storyEdit/index`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log(12231);
    if(!this.data.fresh){
      wx.stopPullDownRefresh();
      return false;
    }
    this.data.fresh = false;
    this.setData({
      pageIndex: 1,
      pageCount: 0,
      dataList: [],
      noMoreShow: false
    })
    wx.stopPullDownRefresh();
    this.getList();
    
  },

  formSubmit(e) {
    console.log(e);
    let formId = e.detail.formId;
    let url = API.URL.WX.UPLOADFORMID;
    util.http({
      url: url,
      dataForm: {
        formId: formId,
      },
      success: ({ data: { bussData } }) => {
        console.log('提交formId成功');
      },
      fail: (res) => {
        console.log(res);
        console.log('提交formId失败');
      },
      revertBack: () => {
        this.formSubmit();
      }
    })
  },
})