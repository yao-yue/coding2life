// pages/searchList/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    tabList:[
      { name: '房车租赁', active: true,},
      { name: '酒店', active: false, },
      { name: '营地', active: false, },
    ],
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    typeIndex:0,
    keyWord:'',
    urlList: [API.URL.CAR.FINDRENTINFO, API.URL.CAR.FINDHOTELBYPAGE, API.URL.CAR.FINDCAMPBYPAGE]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.keyWord ? options.keyWord : '驴道房车'
    });
    this.data.keyWord = options.keyWord ? options.keyWord : '';
    this.getList(API.URL.CAR.FINDRENTINFO);
  },
  switchTab(e) {
    let index = e.currentTarget.dataset.index;
   // this.data.typeIndex = index;
    let tabList = this.data.tabList;
    tabList.forEach((item) => {
      item.active = false;
    })
    tabList[index].active = true;
    this.setData({
      tabList,
      typeIndex:index,
      pageIndex: 1,
      pageCount: 0,
      dataList: [],
      noMoreShow: false,
    });
    let url = this.data.urlList[index];
    // setTimeout(()=>{
      this.getList(url);
    // },500)
  },
  getList(url) {
    this.data.url = url;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let param = {
      pageIndex: this.data.pageIndex,
      pageSize: 10,
      cityLike:this.data.keyWord
    }
    if (this.data.url = API.URL.CAR.FINDRENTINFO){
      param.status = 'on';
    }
    util.http({
      url:url,
      dataForm: param,
      success: ({ data }) => {
        this.setData({
          dataList: this.data.dataList.concat(data.bussData),
          pageCount: data.pageCount
        })
        wx.hideLoading();
        if (!this.data.dataList.length) {
          this.setData({
            noData: true
          })
        }
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getList(this.data.url);
      }
    })
  },
  linkTo(e) {
    let id = e.currentTarget.dataset.id;
    let path;
    if (this.data.typeIndex == 0) { path = 'rentDetail';}
    else if (this.data.typeIndex == 1) { path = 'roomList'; }
    else { path = 'carList'; }
    wx.navigateTo({
      url: `../${path}/index?id=${id}`
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
    this.getList(this.data.url);
  },
})