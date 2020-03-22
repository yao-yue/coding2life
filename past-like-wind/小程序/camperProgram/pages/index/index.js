const API = require('../../common/constant.js');
const util = require('../../utils/util');
const app = getApp();
Page({
  data: {
    authShow:false,
    signShow:false,
    isSign:false,
    wayShow:false,
    wayPay: false,  //  true 余额支付；   false 微信支付
    balance: 0,
    list:[],
    carList: [
      { id: '1', url: '../../images/index_rent.png', name: '房车租赁', path:'rentList'}, 
      { id: '2', url: '../../images/index_hotel.png', name: '酒店', path: 'hotelList' },  
      { id: '3', url: '../../images/index_camp.png', name: '营地', path: 'campList' }, 
    ],
    rentTabList:[],
    rentItemList:[],
    rentCurrentTab: {},
    rentWidth: 0,
    hotelTabList: [],
    hotelItemList: [],
    hotelCurrentTab: {},
    hotelWidth: 0,
    campbaseTabList: [],
    campbaseItemList: [],
    campbaseCurrentTab: {},
    campbaseWidth: 0,
    // 日历 
    calendarShow:false,
    hasEmptyGrid: false,
    cur_year: '',   // 当前年份
    cur_month: '',  // 当前月份
    cur_day: '',  // 当前日期
    today: '',
    weeks_ch: [],  // 当前星期  weeks 
    days: [],//   日期
    daylist: [],
    cur_dayList: [],
    beginDate: '',
    endDate: '',
    dayNum: '',  // 日租
    date:'日期',
    keyWord:'',
    scrollHeightThree:280,
    scrollHeightRent: 450,
    scrollHeightHotel: 340,
    scrollHeightCamp: 340,
    style:true,  // true 正常  false 放大
    pageSize:6,
  },
  onLoad(options) {
    let url1 = API.URL.SYSCODE.FINDHOTCAMPBASECITYGROUP,
      url2 = API.URL.SYSCODE.FINDHOTHOTELCITYGROUP,
      url3 = API.URL.SYSCODE.FINDHOTRENTCITYGROUP;
    this.getHotTabs(url1, 'campbase');
    this.getHotTabs(url2, 'hotel');
    this.getHotTabs(url3, 'rent');
    this.calculate();
    this.setData({
      keyWord: options.keyWord ? options.keyWord:''
    })
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            authShow:true
          }) 
        }
      },
    })
  },
  onShow(){
    let style = wx.getStorageSync('style') ? wx.getStorageSync('style') : 'normal';
    this.getStyle(style);
    // this.setData({
    //   date: '日期'
    // });
    // this.data.beginDate = '';
    // this.data.endDate = '';
    // this.data.dayList = [];
    // this.data.cur_dayList = [];
     wx.removeStorageSync('hotelBeginDate');
     wx.removeStorageSync('hotelEndDate');
     wx.removeStorageSync('hotelDate');
     wx.removeStorageSync('hotelPrice');
     wx.removeStorageSync('hotelMaxPrice');
     wx.removeStorageSync('hotelCityName');
     wx.removeStorageSync('hotelCityCode');
     wx.removeStorageSync('hotelkeyWord');
     wx.removeStorageSync('rentBeginDate');
     wx.removeStorageSync('rentEndDate');
     wx.removeStorageSync('rentDate');
     wx.removeStorageSync('rentCityName');
     wx.removeStorageSync('rentCityCode');
     wx.removeStorageSync('rentkeyWord');
     wx.removeStorageSync('campBeginDate');
     wx.removeStorageSync('campEndDate');
     wx.removeStorageSync('campDate');
     wx.removeStorageSync('campCityName');
     wx.removeStorageSync('campCityCode');
     wx.removeStorageSync('campkeyWord');
  },
  getStyle(style){
    if (style == 'normal') {
      // this.data.pageSize = 6;
      this.setData({
        style: true,
        scrollHeightThree: 280,
      })
    }
    else {
      // this.data.pageSize = 2;
      this.setData({
        style: false,
        scrollHeightThree: 1360,
      })
    }
    // console.log(style);
  },
  formSubmit(e) {
    //this.data.formId = e.detail.formId;
    this.submitFormId(e.detail.formId);
  },
  formSubmitSearch(e){
    // this.data.formId = e.detail.formId;
    this.submitFormId(e.detail.formId);
    this.linkToSearch();
  },
  submitFormId(formId){
    let url = API.URL.WX.UPLOADFORMID;
    util.http({
      url: url,
      dataForm: {formId: formId,},
      success: ({ data: { bussData } }) => {
        console.log('提交formId成功');
      },
      fail: (res) => {
        console.log('提交formId失败');
      },
      revertBack: () => {
        // this.submitFormId(this.data.formId);
      }
    })
  },
  getList() {
    // let url = API.URL.MINI.FINDMINIUSERCOREDETAIL;
    util.http({
      url: url, 
      success: (res) => {
        if (res.status == 200) {
        }
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getList();
      }
    })
  },
  getHotTabs (url, type) {
    let tabListName = `${type}TabList`,
        tabInfoName = `${type}CurrentTab`;
    util.http({
      url: url,
      success: (res) => {
        if (res.status == 200) {
          let resData = res.data.bussData ? res.data.bussData:[];
          
          resData.forEach((e, i) => {
            if (i == 0) {
              e.isActive = true;
            } else {
              e.isActive = false;
            }
          });
          var tabInfo = {
            cityName: resData.length ? resData[0].cityName:'',
            cityCode: resData.length ? resData[0].cityCode:'' 
          }
          this.setData({
            [tabListName]: resData,
            [tabInfoName]: tabInfo
          })
          if(resData.length){
            this.getlistByTab(resData[0].cityCode, type);
          }
          else{
            this.getlistByTab('', type);
          }
        }
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: (res) => {
        this.getHotTabs(url, type);
      }
    });
    
  },
  getlistByTab (code, type) {
    let url = `${API.URL.APIBODY}${type}Info/find${type == "rent" ? "RentInfoBy" : ""}Page`,
        cityCode = code,
        listName = `${type}ItemList`,
        listWidthName = `${type}Width`;
    let dataForm = {
      pageIndex: 1,
      pageSize:6,
      cityCode
    };
    if(type == 'rent'){
      dataForm.status = 'on'
    }
    util.http({
      url,
      dataForm,
      success: (res) => {
        if (res.status == 200) {
          let resData = res.data.bussData,
              length = resData.length || 1;
          resData.forEach((item)=>{
            if (item.cheapestCampsitePrice){
              item.cheapestCampsitePrice = parseFloat(item.cheapestCampsitePrice).toFixed(2);
            }
            else if (item.cheapestRoomPrice) {
              item.cheapestRoomPrice = parseFloat(item.cheapestRoomPrice).toFixed(2);
            }
            else if (item.price) {
              item.price = parseFloat(item.price).toFixed(2);
            }
          })
          this.setData({
            [listName]: resData,
            [listWidthName]: length * 358-40
          })
        }
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: (res) => {
        this.getlistByTab(code, type);
      }
    });
  },
  linkToMore(e){
    let url = e.currentTarget.dataset.url,
        type = e.currentTarget.dataset.type,
        cityName = this.data[type + 'CurrentTab'].cityName,
        cityCode = this.data[type + 'CurrentTab'].cityCode;
    let path = `../${url}/index`;
    if(cityName){
        path = `../${url}/index?cityName=${cityName}&cityCode=${cityCode}`;
    }
    if (this.data.beginDate) {
      path = `../${url}/index?cityName=${cityName}&cityCode=${cityCode}&date=${this.data.date}&beginDate=${this.data.beginDate}&endDate=${this.data.endDate}`;
    }
    wx.navigateTo({
      url: path
    })
  },
  linkToList(e){
    let path = e.currentTarget.dataset.path;
    let url = `../${path}/index`;
    if(this.data.beginDate){
      url =  `../${path}/index?date=${this.data.date}&beginDate=${this.data.beginDate}&endDate=${this.data.endDate}`;
    }
    wx.navigateTo({
      url:url
    })
  },
  linkToDetail(e){
    let path = e.currentTarget.dataset.path;
    let id = e.currentTarget.dataset.id;
    let url = `../${path}/index?id=${id}`;
    wx.navigateTo({
      url: url
    })
  },
  switchTab(e){
    let index = parseInt(e.currentTarget.dataset.index),
        type = e.currentTarget.dataset.type,
        code = e.currentTarget.dataset.code,
        city = e.currentTarget.dataset.name,
        targetListName = `${type}TabList`,
        currentTabName = `${type}CurrentTab`,
        targetList = this.data[targetListName];
    targetList.forEach((item) => {
        item.isActive = false;
      })
    targetList[index].isActive = true;
    this.setData({
      [targetListName]: targetList,
      [currentTabName]: {cityName: city, cityCode: code}
    })
    this.getlistByTab(code, type)
  },
  scanTap() {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let url = API.URL.USERPRODUCT.BINDCODE;
        util.http({
          url: url,
          dataForm: {
            userCode: res.result
          },
          success: (data) => {
            wx.showToast({
              title: data.msg
            })
          },
          fail: (res) => {
            this.dialogShow(res.msg)
          },
          revertBack: () => {
            wx.reLaunch({
              url: '../login/index'
            })
          }
        })
      }
    })
  },
  linkToSublease(){
    wx.navigateTo({
      url: '../subleaseInstructions/index',
    })
  },
  linkToSearch() {
    wx.navigateTo({
      url: `../search/index?fromPage=searchList`
    })
  },
  cancelAuth(){
    this.setData({
      authShow:false
    })
  },
  cancelSign() {
    this.setData({
      signShow: false
    })
  },
  sign(){
    if(!this.data.isSign){
      this.setData({
        signShow: true
      })
    }
  },
  signFee(){
    this.setData({
      signShow: false,
      wayShow:true,
    })
  },
  signFree(){
    this.setData({
      signShow: false,
      isSign:true
    })
    wx.showToast({
      title: '签到成功',
      icon:'success',
      duration:1500
    })
  },
  modalClick(){this.setData({wayShow: false})},
  changePayWay(){ },
  confirmPay(){
    
  },
  //日历插件 
  calculate() {
    //  日历插件  begin
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    const today = new Date(cur_year, cur_month - 1, cur_day);
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      cur_day: cur_day,
      today: today,
      weeks_ch: weeks_ch,
    });
    this.initDayList(cur_year, cur_month, cur_day);
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month,cur_day);
    // 日历插件  finished 
  },
  submitDate() {
    if (!this.data.dayList.length) {
      this.setData({
        calendarShow: false,
        beginDate: '',
        endDate: '',
        dayNum: '',
        date:'日期',
      })
      return false;
    }
    if (this.data.dayList.length == 1){
      wx.showToast({ title: '请选择结束日期', image: '../../images/warn.png', duration: 2000 })
      return false;
    }
    let dayList = this.data.dayList;
    let beginDate = dayList[0].year + '-' + this.dateForm(dayList[0].month) + '-' + this.dateForm(dayList[0].day)
    let endDate = dayList[1].year + '-' + this.dateForm(dayList[1].month) + '-' + this.dateForm(dayList[1].day)
    let time1 = (new Date(dayList[0].year, dayList[0].month - 1, dayList[0].day)).getTime();
    let time2 = (new Date(dayList[1].year, dayList[1].month - 1, dayList[1].day)).getTime();
    let dayNum = parseInt(((time2 - time1) / (1000 * 60 * 60 * 24)));
    let date = dayList[0].month + '月' + dayList[0].day + '日至' + dayList[1].month + '月' + dayList[1].day + '日'
    this.setData({
      beginDate: beginDate,
      endDate: endDate,
      dayNum: dayNum,
      date,
      calendarShow: false
    })
    //  totalPrice: parseFloat(this.data.detailInfo.price * this.data.carNum * dayNum).toFixed(2)
    // 弹窗消失 ，并计算天数
  },
  dateForm(num) {
    if (num > 9) {
      return num;
    } else {
      return '0' + num
    }
  },
  cancel() {
    this.setData({
      calendarShow: false
    })  // 日历为弹窗时启用   弹窗消失
  },
  chooseDate() {
    this.setData({
      calendarShow: true
    })
  },
  initDayList(year, month, day) {
    let thisMonthDays = this.getThisMonthDays(year, month);
    let dayList = [];
    let dayItem1 = {}, dayItem2 = {};
    dayItem1.year = year;
    dayItem1.month = month;
    dayItem1.day = day;
    dayItem1.index = day - 1;
    if (day == thisMonthDays) {
      if (month == 12) {
        dayItem2.year = year + 1;
        dayItem2.month = 1;
        dayItem2.day = 1;
      }
      else {
        dayItem2.year = year;
        dayItem2.month = month + 1;
        dayItem2.day = 1;
      }
      dayItem2.index = 0;
    }
    else {
      dayItem2.year = year;
      dayItem2.month = month;
      dayItem2.day = day + 1;
      dayItem2.index = day;
    }
    dayList.push(dayItem1);
    dayList.push(dayItem2);
    let beginDate = dayItem1.year + '-' + this.dateForm(dayItem1.month) + '-' + this.dateForm(dayItem1.day);
    let endDate = dayItem2.year + '-' + this.dateForm(dayItem2.month) + '-' + this.dateForm(dayItem2.day);
    this.setData({
      dayList: [],
      cur_dayList: [],
      //beginDate: beginDate,
      //endDate: endDate
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month, today) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false,
        canChoose: true,
        isWrap: false,
        isToday:false
      });
    }
    let dayList = this.data.dayList;
    let cur_dayList = this.data.cur_dayList;
    if(dayList.length){
      dayList.forEach(function (item) {
        if (item.year == year && item.month == month) {
          cur_dayList.forEach(function (indexTtem) {
            if (indexTtem.year == year && indexTtem.month == month)
              days[indexTtem.index].choosed = true;
          })
        }
      })
    }
    let toTime = this.data.today.getTime();
    days.forEach(function (item) {
      let cur_day = new Date(year, month - 1, item.day);
      let cur_time = cur_day.getTime();
      if (cur_time < toTime) {
        item.canChoose = false;
      }
      if(item.day == today){
        item.isToday = true
      }
    });
    if (dayList.length == 2) {
      this.isWrap(days, year, month, dayList);
    }
    this.setData({
      days: days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    let newYear = cur_year;
    let newMonth = cur_month;
    let dayList = this.data.dayList;
    if (handle === 'prev') {    // prev
      newMonth = cur_month - 1;
      newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
    }
    else if (handle === 'next') {                    // next 
      newMonth = cur_month + 1;
      newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
    }
    this.setData({
      cur_year: newYear,
      cur_month: newMonth
    });
    let date = new Date();
    let current_year = date.getFullYear();
    let current_month = date.getMonth() + 1;
    let current_day = date.getDate();
    if (newYear == current_year && newMonth == current_month){
      this.calculateDays(newYear, newMonth, current_day);
    }
    else{
      this.calculateDays(newYear, newMonth,'');
    }
    this.calculateEmptyGrids(newYear, newMonth);
  },
  tapDayItem(e) {
    let idx = e.currentTarget.dataset.idx;
    let dayList = this.data.dayList;
    let cur_year = this.data.cur_year;
    let cur_month = this.data.cur_month;
    let isCancel = false;
    let days = this.data.days;
    if (days[idx].canChoose) {
      dayList.forEach(function (item, index) {
        if (item.index == idx && item.year == cur_year && item.month == cur_month) {
          dayList.splice(index, 1)
          days.forEach(function (item, index) {
            item.isWrap = false;
          })
          isCancel = true;
        }
      })
      if (dayList.length == 2) {
        console.log('只能选择两个日期');  // 重新选择  开始和结束日期
        wx.showToast({ title: '只能选两个日期', image: '../../images/warn.png', duration: 2000 })
      }
      else {
        days[idx].choosed = !days[idx].choosed;
        if (!isCancel) {
          let dayItem = {};
          dayItem.year = cur_year;
          dayItem.month = cur_month;
          dayItem.day = idx + 1;
          dayItem.index = idx;
          dayList.push(dayItem);
        }
        if (dayList.length == 2) {
          console.log('正在选择第二个日期');
          this.max(dayList);
          this.isWrap(days, cur_year, cur_month, dayList);
        }
        this.setData({
          days: days,
          dayList: dayList,
          cur_dayList: dayList
        });
      }
    }
    else {
      console.log('当前日期不可选');
      wx.showToast({ title: '当前日期不可选', image: '../../images/warn.png', duration: 2000 })

    }
  },
  isWrap(days, cur_year, cur_month, dayList) {
    let beginDay = new Date(dayList[0].year, dayList[0].month - 1, dayList[0].day);
    let endDay = new Date(dayList[1].year, dayList[1].month - 1, dayList[1].day);
    let time1 = beginDay.getTime();
    let time2 = endDay.getTime();
    days.forEach(function (item, index) {
      let day = new Date(cur_year, cur_month - 1, item.day);
      let time = day.getTime();
      if (time > time1 && time < time2) {
        item.isWrap = true;
      }
    })
    return days;
  },
  max(dayList) {
    let beginDay = dayList[0];
    let endDay = dayList[1];
    if (beginDay.year > endDay.year) {
      this.switchDay(dayList);
    }
    else if (beginDay.year == endDay.year) {
      if (beginDay.month > endDay.month) {
        this.switchDay(dayList);
      }
      else if (beginDay.month == endDay.month) {
        if (beginDay.day > endDay.day) {
          this.switchDay(dayList);
        }
      }
    }
    return dayList;
  },
  switchDay(dayList) {
    let temp = '';
    temp = dayList[0];
    dayList[0] = dayList[1];
    dayList[1] = temp;
    return dayList;
  },
  clear() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    this.setData({
      cur_year,
      cur_month,
      dayList: [],
      cur_dayList: [],
      beginDate: '',
      endDate: '',
      date: '日期'
    });
    this.initDayList(cur_year, cur_month, cur_day);
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month, cur_day);
    console.log(this.data.days);
  },


  binduserInfo(e) {
    // console.log(e);
    let res = e.detail;
    if (res.errMsg == 'getUserInfo:fail auth deny') {
      console.log('用户拒绝授权');
      this.getAccess('小程序需要获取用户权限，点击确认前往设置');
    }
    else {
      console.log('用户允许授权');
      this.saveUserInfo(res.encryptedData, res.iv);
    }
  },
  saveUserInfo(encryptedData, iv) {
    const openId = wx.getStorageSync('openId');
    let data = {
      openId: openId,
      encryptedData: encryptedData,
      iv: iv,
    };
    wx.request({
      url: API.URL.WX.SAVE,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        body: JSON.stringify(data)
      },
      dataType: 'json',
      method: 'POST',
      success: (res) => {
        console.log('信息保存成功');
        this.setData({
          authShow:false
        })
      }
    });
  },
  getAccess: function (text) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            authShow: false
          })
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
                    if (res.authSetting['scope.userInfo']) {
                      wx.showToast({ title: '开启成功', icon: 'success', duration: 2000 })
                      wx.getUserInfo({
                        withCredentials: true,
                        success: (res) => {
                          that.saveUserInfo(res.encryptedData, res.iv);
                        },
                        fail: (res) => {
                          if (res.errMsg == 'getUserInfo:fail auth deny') {
                            that.getAccess('小程序需要获取用户权限，点击确认前往设置');
                          }
                          else {
                            console.log(res.errMsg);
                          }
                        }
                      })
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
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              that.saveUserInfo(res.encryptedData, res.iv);
            },
            fail: (res) => {
              if (res.errMsg == 'getUserInfo:fail auth deny') {
                that.getAccess('小程序需要获取用户权限，点击确认前往设置');
              }
              else {
                console.log(res.errMsg);
              }
            }
          })
        }
      }
    })
  },
})
