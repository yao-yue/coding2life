// pages/confirmOrder/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    wayShow: false, // 支付方式
    wayPay: false,  //  true 余额支付；   false 微信支付
    balance: 0,
    totalPrice: 0,
    // 日历选择器
    calendarShow: false,  //日历
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
    dayNum:0,  //天数
    // 提交表单
    id: '',
    orderType: '',
    detailInfo: {},
    carNum: 1,
    name: '',
    mobile: '',
    totalPrice:0,
    discount:0,
    discountRate:'',
    payPrice:0,
    spendablePoint:'',
    balance:0,
    linkType:'',
    btnClick:true,
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.setData({
      orderType: options.orderType,
      name: wx.getStorageSync('name') ? wx.getStorageSync('name') : '',
      mobile: wx.getStorageSync('mobile') ? wx.getStorageSync('mobile') : '',
    })
    if (options.orderType == 'hotel') { this.getRoomDetail(); this.data.linkType = 'hotel_product';}
    else { this.getCarDetail(); this.data.linkType = 'campbase_product';}

    this.getDiscount();
    this.getInfo();
    // 初始化日历插件
    this.calculate()
  },
  //详情
  getRoomDetail() {
    let url = API.URL.CAR.FINDROOMDETAILBYID;
    util.http({
      url: url,
      dataForm: {
        id: this.data.id
      },
      success: ({ data: { bussData } }) => {
        this.setData({
          detailInfo: bussData
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getRoomDetail();
      }
    })
  },
  getCarDetail() {
    let url = API.URL.CAR.FINDCAMPCARDETAILBYID;
    util.http({
      url: url,
      dataForm: {
        id: this.data.id
      },
      success: ({ data: { bussData } }) => {
        this.setData({
          detailInfo: bussData
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getCarDetail();
      }
    })
  },
  getDiscount() {
    let url = API.URL.SYS.FINDDISCOUNTRULE;
    util.http({
      url: url,
      dataForm: {
        varType:'spendable_point',
        varKey:'spendable_point_deduction'
      },
      success: ({ data }) => {
        // console.log(bussData);
        this.setData({
          discountRate: data.bussData ? data.bussData.varValue : 0
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getDiscount();
      }
    })
  },
  getInfo() {
    let url = API.URL.USERPRODUCT.FINDUSERDETAIL;
    util.http({
      url: url,
      success: ({ data }) => {
        this.setData({
          spendablePoint: (data.bussData.spendablePoint).toFixed(2),
          balance: data.bussData.balance
        })
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  }, 
  changeCarNum(e) {
    let type = e.currentTarget.dataset.type;
    let num = this.data.carNum;
    if (type == 'plus') { num++; }
    else {
      if (num <= 1) { console.log('不能再减少了'); }
      else { num--; }
    }
    this.getPriceByDiscount(num);
  },
  numberGet(e) {
    let num = e.detail.value < 1 ? 1 : e.detail.value;
    this.getPriceByDiscount(num)
  },
  getPriceByDiscount(num){
    let totalPrice = parseFloat(this.data.detailInfo.price * num * this.data.dayNum).toFixed(2);
    let payPrice = totalPrice;
    if (this.data.discount * this.data.discountRate > totalPrice) {  // 抵扣金额大于总额
      this.dialogShow('抵扣金额大于支付总额');
      this.setData({ discount:0 })
    }
    if (this.data.discount) {
        payPrice = parseFloat(this.data.detailInfo.price * num * this.data.dayNum - this.data.discount * this.data.discountRate).toFixed(2)
    }
    this.setData({
        carNum: num,
        totalPrice,
        payPrice,
    });
  },
  nameBind(e) {
    this.data.name = e.detail.value;
  },
  mobileBind(e) {
    this.data.mobile = e.detail.value;
  },
  discountFoucs() {
    if (!this.data.beginDate) {
      this.dialogShow('请先选择日期');
    }
  },
  discountBind(e) {
    let discount = e.detail.value;
    let spendablePoint = parseFloat(this.data.spendablePoint);
    console.log(discount +'===' +spendablePoint);
    if (discount > spendablePoint) {
      this.dialogShow('抵扣积分已超过可用积分');
      this.setData({ discount: 0 })
    }
    else {
      this.setData({ discount });
    }
    this.getPriceByDiscount(this.data.carNum);
    // else{
    //   let totalPrice = this.data.detailInfo.price * this.data.dayNum * this.data.carNum;
    //   if (discount * this.data.discountRate > totalPrice){  // 抵扣金额大于总额
    //     this.dialogShow('抵扣金额大于支付总额');
    //     this.setData({ discount:0 })
    //   }
    //   let payPrice = parseFloat(totalPrice - this.data.discount * this.data.discountRate).toFixed(2);
    //     this.setData({
    //         payPrice
    //     })
    // }
  },
  submit() {
    if (!this.data.beginDate) {this.dialogShow('请先选择日期'); return false;}
    if (!this.data.name) { this.dialogShow('请先填写姓名'); return false; }
    if (!this.data.mobile) { this.dialogShow('请先填写手机号'); return false; }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) { this.dialogShow('手机号不合法'); return false;}
    // if (this.data.discount > this.data.spendablePoint) {this.dialogShow('抵扣积分已超过可用积分');return false; }
    // if (this.data.discount * this.data.discountRate > this.data.totalPrice) { this.dialogShow('抵扣金额大于支付总额'); return false;}
    if (this.data.payPrice == 0) { this.dialogShow('付款金额需大于0'); return false; }
    this.setData({ wayShow: true });
  },
  modalClick() {
    this.setData({ wayShow: false })
  },
  changePayWay(e) {
    let type = e.currentTarget.dataset.id;
    if (type == 'weixin') { this.setData({ wayPay: false }) }
    else { this.setData({ wayPay: true }) }
  },
  forbidPay(){
    wx.showToast({ title: '余额不足', image: '../../images/warn.png', duration: 1000 });
  },
  confirmBtn(){
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let arr = [{
      productId: this.data.id,
      productType: this.data.linkType,
      productName:this.data.detailInfo.name,
      nums: this.data.carNum,
      price: this.data.detailInfo.price
    }]
    wx.setStorageSync('name', this.data.name)
    wx.setStorageSync('mobile', this.data.mobile)
    let url;
    let bookStartDate = (new Date(this.data.beginDate)).getTime();
    let bookEndDate = (new Date(this.data.endDate)).getTime();
    let param = {
        trueName: this.data.name,
        mobile: this.data.mobile,
        bookStartDate: bookStartDate,
        bookEndDate: bookEndDate,
        orderType:this.data.linkType,
        spendablePoint: this.data.discount ? this.data.discount:0,
        itemList: arr
    }
    // 支付方式
    if (this.data.wayPay) {
      url = API.URL.SYS.COINPAY;
      param.payType = 'coins';
    } else {
      url = API.URL.SYS.WEIXINPAY;
      param.payType = 'weixin';
    }
    console.log(param);
    util.http({
      url: url,
      data: param,
      success: (data) => {
        this.data.btnClick = true;
        if (!this.data.wayPay) {  // 微信支付
          this.payRequest(data.data.bussData)
        } else {
          if (data.status == 200) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../myOrder/index?orderType=' + this.data.linkType
              })
            }, 2000)
          } else {
            this.setData({ wayShow: false })
            this.dialogShow(data.msg);
          }
        }
      },
      fail: (res) => {
        console.log(res)
        this.setData({ wayShow: false })
        this.dialogShow(res.msg);
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  //小程序支付
  payRequest(item) {
    let that = this;
    wx.requestPayment(
      {
        'timeStamp': item.timestamp,
        'nonceStr': item.noncestr,
        'package': item.packageDesc,
        'signType': item.signType,
        'paySign': item.sign,
        'success': (res) => {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({ wayShow: false })
            setTimeout(() => {
              wx.redirectTo({
                url: '../myOrder/index?orderType=' + this.data.linkType
              })
            }, 2000)
        },
        'fail': (res) => {
          wx.showToast({
            title: '支付取消',
            duration: 2000,
            image: '../../images/fail.png'
          })
          this.setData({ wayShow: false })
          setTimeout(() => {
            wx.redirectTo({
              url: '../myOrder/index?orderType=' + this.data.linkType
            })
          }, 2000)
        }
      })
  },
  //弹出框
  dialogShow: function (text) {
    this.setData({
      dialogText: text
    })
    wx.hideLoading()
    setTimeout(() => {
      this.setData({
        dialogText: ''
      })
    }, 2000)
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
        calendarShow: false
      })
      return false;
    }
    if (this.data.dayList.length == 1) {
      wx.showToast({ title: '请选择结束日期', image: '../../images/warn.png', duration: 2000 })
      return false;
    }
    let dayList = this.data.dayList;
    let beginDate = dayList[0].year + '-' + this.dateForm(dayList[0].month) + '-' + this.dateForm(dayList[0].day)
    let endDate = dayList[1].year + '-' + this.dateForm(dayList[1].month) + '-' + this.dateForm(dayList[1].day)
    let time1 = (new Date(dayList[0].year, dayList[0].month - 1, dayList[0].day)).getTime();
    let time2 = (new Date(dayList[1].year, dayList[1].month - 1, dayList[1].day)).getTime();
    let dayNum = parseInt(((time2 - time1) / (1000 * 60 * 60 * 24)));
    // 计算价格
    let totalPrice = parseFloat(this.data.detailInfo.price * dayNum * this.data.carNum).toFixed(2);
    let payPrice = totalPrice;
    if (this.data.discount) {
      payPrice = parseFloat(this.data.detailInfo.price * dayNum * this.data.carNum - this.data.discount * this.data.discountRate).toFixed(2)
    }
    this.setData({
      calendarShow: false,
      beginDate: beginDate,
      endDate: endDate,
      dayNum: dayNum,
      totalPrice,
      payPrice,
    })
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
        isToday: false
      });
    }
    let dayList = this.data.dayList;
    let cur_dayList = this.data.cur_dayList;
    if (dayList.length) {
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
      if (item.day == today) {
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
      dayNum: ''
    })
    this.initDayList(cur_year, cur_month, cur_day);
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month, cur_day);
    console.log(this.data.days);
  },
})