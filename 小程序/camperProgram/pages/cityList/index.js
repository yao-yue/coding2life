const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    typeName: '',
    fromPage:'',
    city:'全国',
  },


  onLoad: function (options) {
    this.data.typeName = options.type;
    this.data.fromPage = options.fromPage;
    let url;
    if (options.fromPage == 'rentList'){
      url = API.URL.CAR.FINDRENTCITY;
    }
    else if (options.fromPage == 'hotelList') {
      url = API.URL.CAR.FINDHOTELCITY;
    }
    else if (options.fromPage == 'campList'){
      url = API.URL.CAR.FINDCAMPCITY;
    }
    else{
      url = API.URL.CAR.FINDCAMPCITY; // 推荐城市
    }
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userLocation']) {
    //       let city = wx.getStorageSync('city');
    //       this.setData({ city });
    //     }
    //     else{
    //       this.getAddress();
    //     }
    //   }
    // })
    this.getList(url);
    
  },
  getList(url) {
    console.log(url);
    util.http({
      url: url,
      success: ({ data: { bussData } }) => {
        this.setData({
          dataList: bussData
        })
      },
      fail: (res) => {

      },
      revertBack: () => {
        this.getList();
      }
    })
  },
  citySelect(e) {
    this.clear();
    let cityCode = e.currentTarget.dataset.code;
    let cityName = e.currentTarget.dataset.name;
    // let obj = {
    //   code: e.currentTarget.dataset.code,
    //   name: e.currentTarget.dataset.name
    // }
    // wx.setStorageSync('city', obj)
    wx.redirectTo({
      url: `../${this.data.fromPage}/index?cityCode=${cityCode}&cityName=${cityName}`
    })
  },
  citySelectBy(e) {
    this.clear();
    console.log(this.data.city);
    if(this.data.city){
      wx.redirectTo({
        url: `../${this.data.fromPage}/index?cityName=${this.data.city}&selectby=citylike`
      })
    }
    else{
      wx.redirectTo({
        url: `../${this.data.fromPage}/index?cityName=全国&selectby=citylike`
      })
    }
  },
  clear(){
    if(this.data.fromPage == 'rentList'){
      wx.removeStorageSync('rentCityName');
      wx.removeStorageSync('rentCityCode');
    }
    else if (this.data.fromPage == 'hotelList') {
      wx.removeStorageSync('hotelCityName');
      wx.removeStorageSync('hotelCityCode');
    }
    else if (this.data.fromPage == 'campList') {
      wx.removeStorageSync('campCityName');
      wx.removeStorageSync('campCityCode');
    }
  },
  getAddress() {
    wx.chooseLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res);
        let address = res.address;
        let name = res.name;
        let listOne = address.split('省');
        let listTwo = listOne[1] ? (listOne[1].split('市') ? listOne[1].split('市') : listOne[1].split('区') ? listOne[1].split('区') : []) : [];
        let city = listTwo[0] ? listTwo[0] : listOne[1] ? listOne[1] : address;
        wx.setStorageSync('city', city);
        this.setData({ city });
      },
      fail: (res) => {
        console.log(res);
        if (res.errMsg == 'chooseLocation:fail auth deny') {
          this.getAccess('小程序需要获取定位，点击确认前往设置')
        }
        else {
          console.log(res.errMsg);
        }
      },
    })
  },
  getAccess: function (text) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: text,
            confirmText: '确认',
            cancelText: '取消',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    console.log(res);
                    if (res.authSetting['scope.userLocation']) {
                      wx.showToast({ title: '开启成功', icon: 'success', duration: 1500 })
                      that.getAddress();
                    }
                    else {
                      that.getAccess('关闭授权可能会无法使用小程序部分功能，可点击确认前往重新开启设置');
                    }
                  }
                });
              }
            }
          })
        }
        else {
          console.log('已获取用户权限');
        }
      }
    })
  },
  onShareAppMessage: function () {

  }
})