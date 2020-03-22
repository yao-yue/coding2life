// pages/routeDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    detailInfo: {},
    // 日历选择器
    calendarShow: false,  //日历
    hasEmptyGrid: false,
    cur_year: '',   // 当前年份
    cur_month: '',  // 当前月份
    cur_day: '',  // 当前日期
    today: '',
    weeks_ch: [],  // 当前星期  weeks 
    days: [],//   日期
    choose_year: '',
    choose_month: '',
    choose_day: '',
    beginDate: '',
  },
  onLoad: function (options) {
    this.data.id = options.id ? options.id : '';
    this.getDetail();
    // 初始化日历插件
    setTimeout(() => {
      this.calculate();
    }, 500)
  },
  //详情
  getDetail() {
    let url = API.URL.CAR.FINDLINEDETAILBYID;
    util.http({
      url: url,
      dataForm: {
        id: this.data.id
      },
      success: ({ data: { bussData } }) => {
        var that = this;
        WxParse.wxParse('article', 'html', bussData.contents, that, 10);
        bussData.price = bussData.price.toFixed(2);
        this.setData({
          detailInfo: bussData
          // contents: bussData.contents
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getDetail();
      }
    })
  },
  linkToConfirm(date) {
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    wx.navigateTo({
      url: `../confirmLineOrder/index?id=${this.data.id}&orderType=line&beginDate=${date}`
    })
  },
  makeCall(e) {
    let mobile = e.currentTarget.dataset.mobile;
    console.log(mobile);
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  linkToComment(e) {
    wx.navigateTo({
      url: '../commentList/index?id=' + this.data.detailInfo.id + '&productType=line_product'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '驴道房车',
      path: '/pages/routerDetail/index?id=' + this.data.detailInfo.id,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },


  //日历插件 
  calculate() {
    //  日历插件  begin
    const date = new Date();

    const startDate = this.data.detailInfo.startDate.split('-');
    const cur_year = parseInt(startDate[0]);
    const cur_month = parseInt(startDate[1]);
    const to_day = date.getDate();
    // const cur_year = date.getFullYear();
    // const cur_month = date.getMonth() + 1;
    // const cur_day = date.getDate();
    // const today = new Date(cur_year, cur_month - 1, cur_day);
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      // cur_day: cur_day,
      today: date,
      weeks_ch: weeks_ch,
    });
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month, to_day);
    // 日历插件  finished 
  },
  submitDate() {
    if (!this.data.beginDate) {
      this.setData({
        calendarShow: false
      })
      return false;
    }
    this.setData({
      calendarShow: false
    })
    console.log(this.data.beginDate);
    this.linkToConfirm(this.data.beginDate);
    // 计算价格
    // let beginDate = this.data.beginDate;
    // let totalPrice = parseFloat(this.data.detailInfo.price * this.data.carNum).toFixed(2);
    // let payPrice = totalPrice;
    // if (this.data.discount) {
    //  payPrice = parseFloat(this.data.detailInfo.price * this.data.carNum - this.data.discount * this.data.discountRate).toFixed(2)
    // }
    // this.setData({
    //   calendarShow: false,
    //   beginDate,
    //   totalPrice,
    //   payPrice,
    // })
    // 弹窗消失 ，并计算天数, 总价格，实际支付价格
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
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    this.setData({
      calendarShow: true
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
    let date = new Date();
    let current_year = date.getFullYear();
    let current_month = date.getMonth() + 1;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false,
        canChoose: true,
        // canBook: false,
        isToday: false
      });
    }
    let toTime = this.data.today.getTime();
    let startDate = this.data.detailInfo.startDate.replace(/-/g, ':').replace(' ', ':');
    startDate = startDate.split(':');
    let endDate = this.data.detailInfo.endDate.replace(/-/g, ':').replace(' ', ':');
    endDate = endDate.split(':');
    console.log(startDate );
    console.log(endDate);
    let startTime = (new Date(startDate[0], startDate[1] - 1, startDate[2], startDate[3], startDate[4], startDate[5])).getTime();
    let endTime = (new Date(endDate[0], endDate[1] - 1, parseInt(endDate[2])+1, endDate[3], endDate[4], endDate[5])).getTime();
    days.forEach(function (item) {
      let cur_time = (new Date(year, month - 1, item.day, '23', '59', '59')).getTime();
      if (cur_time < toTime || cur_time > endTime || cur_time < startTime) {
        item.canChoose = false;
      }
      if (current_year == year && current_month == month && item.day == today) {
        item.isToday = true
      }
    });
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
    if (newYear == current_year && newMonth == current_month) {
      this.calculateDays(newYear, newMonth, current_day);
    }
    else {
      this.calculateDays(newYear, newMonth, '');
    }
    this.calculateEmptyGrids(newYear, newMonth);
  },
  tapDayItem(e) {
    let idx = e.currentTarget.dataset.idx;
    let isCancel = false;
    let days = this.data.days;
    if (days[idx].canChoose) {
      days.forEach((item) => {
        item.choosed = false;
      })
      days[idx].choosed = true;
      this.data.beginDate = this.data.cur_year + '-' + this.dateForm(this.data.cur_month) + '-' + this.dateForm(days[idx].day)
      this.setData({
        choose_year: this.data.cur_year,
        choose_month: this.data.cur_month,
        choose_day: days[idx],
        days: days
      })
    }
    else {
      wx.showToast({ title: '当前日期不可选', image: '../../images/warn.png', duration: 2000 })
    }
  },
  clear() {
    this.setData({
      choose_year: '',
      choose_month: '',
      choose_day: '',
      beginDate: '',
      totalPrice: 0,
      payPrice: 0
    })
    this.calculate();
  },
})