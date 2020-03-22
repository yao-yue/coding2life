// pages/storySortList/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    keyWord:'',
    sortFormat: { 'SCENERY': '景点', 'FOOD': '美食', 'CULTURE': '文化', 'ACTIVITY': '活动'}
  },
  onLoad: function (options) {
    if (options.keyWord){
      let title = options.keyWord + '·' + this.data.sortFormat[options.sortType]
      wx.setNavigationBarTitle({
        title:title
      });
    }
    this.data.keyWord = options.keyWord ? options.keyWord : '';
    this.getList(options.sortType);
  },
  getList(msgType) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let url = API.URL.CAR.FINDINFOMSGBYPAGE;
    let param = {
      pageIndex: this.data.pageIndex,
      pageSize: 10,
      // status: 'on',
      msgType: msgType
    }
    if (this.data.keyWord) {
      param.msgCityLike = this.data.keyWord;
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
  onShareAppMessage: function () {

  }
})