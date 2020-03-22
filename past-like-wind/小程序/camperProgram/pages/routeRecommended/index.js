// pages/routeRecommended/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    id: '',
    // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
    keyWord: '',
    dayList:[
      { name: '不限', value: '', active: true },
      { name: '1-7天', value: '', active: false },
      { name: '8-15天', value: '', active: false },
      { name: '16天以上', value: '', active: false },
    ],
    dayChooseShow:false,
    cityName:'目的地',
    dayNum:'天数'

  },
  onLoad: function (options) {
    this.data.cityCode = options.cityCode ? options.cityCode : '';
    this.setData({
      cityName: options.cityName ? options.cityName :'目的地'
    })
  },
  onShow: function () {
    this.getList();
  },
  linkTo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../routeDetail/index?id=${id}`
    })
  },
  chooseCity() {
    wx.navigateTo({
      url: `../cityList/index?fromPage=routeRecommended`
    })
  },
  chooseDay(){
    this.setData({ dayChooseShow: !this.data.dayChooseShow })
  },
  selectDayItem(e){
    let index = e.currentTarget.dataset.index;
    this.data.dayList.forEach((item)=>{
      item.active = false;
    })
    this.data.dayList[index].active = true;
    this.setData({
      dayList:this.data.dayList,
      dayNum:this.data.dayList[index].name,
      dayChooseShow:false,
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
    let url = API.URL.CAR.FINDLINEBYPAGE;
    let param = {
      pageIndex: this.data.pageIndex,
      pageSize: 6,
    }
    let today = (new Date()).toISOString().split('T')[0];
    // console.log(today);
    param.startDate = this.data.beginDate ? this.data.beginDate : today;
    if (this.data.endDate) {
      param.endDate = this.data.endDate;
    }
    util.http({
      url: url,
      dataForm: param,
      success: ({ data }) => {
        let dataList = this.data.dataList.concat(data.bussData);
        dataList.forEach((item) => {
          if (item.price) {
            item.price = parseFloat(item.price).toFixed(2);
          }
        })
        this.setData({
          dataList: dataList,
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})