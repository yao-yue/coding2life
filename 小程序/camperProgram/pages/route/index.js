// pages/route/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
const app = getApp();
Page({
  data: {
    dataList: [],
    campWidth:'',
    // 页码
    pageIndex: 1,
    pageCount: 0,
    normalList: [],
    normalWidth:'',
    themeList:[],
    themeWidth: '',
  },
  onLoad(options) {
    this.getSortByType('normal');
    this.getSortByType('theme');
    this.getList();
  },
  onShow(){
    // this.getSortByType('normal');
    // this.getSortByType('theme');
    // this.getList();
  },
  getSortByType(route){
    let url = API.URL.CAR.FINDLINECATEGORYBYPAGE;
    let listName = `${route}List`,
      listWidthName = `${route}Width`;
    let param = {
      pageIndex:this.data.pageIndex,
      pageSize:100,
      route:route
    }
    util.http({
      url: url,
      dataForm:param,
      success: (res) => {
        if (res.status == 200) {
          let resData = res.data.bussData,
             length = resData.length || 1;
          let list = [];
          for(let i = length-1; i>=0; i--){
            list.push(resData[i]);
          }
          this.setData({
            [listName]: list,
            [listWidthName]: length * 260 - 20
          })
        }
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getSortByType('normal');
        this.getSortByType('theme');
      }
    })
  },
  getList() {
    let url = API.URL.CAR.FINDCAMPBYPAGE;
    let param = {
      pageIndex:1,
      pageSize:6,
      status:'on'
    }
    util.http({
      url: url,
      dataForm: param,
      success: ({ data }) => {
        let length = data.bussData.length || 1;
        let dataList = data.bussData;
        dataList.forEach((item) => {
          if (item.cheapestCampsitePrice) {
            item.cheapestCampsitePrice = item.cheapestCampsitePrice.toFixed(2);
          }
        })
        this.setData({
          dataList,
          campWidth: length * 358 - 40
        })
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getList();
      }
    })
  },
  linkToMore(e) {
    wx.navigateTo({
      url: `../campList/index`
    })
  },
  linkToList(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let url = `../routeList/index?id=${id}&name=${name}`;
    wx.navigateTo({
      url: url
    })
  },
  linkToDetail(e) {
    let id = e.currentTarget.dataset.id;
    let url = `../carList/index?id=${id}`;
    wx.navigateTo({
      url: url
    })
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
  linkToRecommend(){
    wx.navigateTo({
      url: '../routeRecommended/index',
    })
  }
})
