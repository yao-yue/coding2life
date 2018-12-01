// pages/confirmLineOrde/index.js
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
    choose_year:'',
    choose_month: '',
    choose_day: '',
    beginDate: '',
    // 提交表单
    id: '',
    detailInfo: {},
    carNum: 1,
    name: '',
    mobile: '',
    totalPrice: 0,
    discount: 0,
    discountRate: '',
    payPrice: 0,
    spendablePoint: '',
    balance: 0,
    linkType: 'line_product',
    btnClick:true,
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.setData({
      beginDate:options.beginDate,
      name: wx.getStorageSync('name') ? wx.getStorageSync('name') : '',
      mobile: wx.getStorageSync('mobile') ? wx.getStorageSync('mobile') : '',
    })
    this.getLineDetail(); 
    this.getDiscount();
    this.getInfo();
    // 初始化日历插件
    setTimeout(()=>{
      this.calculate();
    },500)
  },
  getLineDetail() {
    let url = API.URL.CAR.FINDLINEDETAILBYID;
    util.http({
      url: url,
      dataForm: {
        id: this.data.id
      },
      success: ({ data: { bussData } }) => {
        this.setData({
          detailInfo: bussData,
          totalPrice:bussData.price,
          payPrice:bussData.price,
        })
        console.log(this.data.detailInfo);
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getLineDetail();
      }
    })
  },
  getDiscount() {
    let url = API.URL.SYS.FINDDISCOUNTRULE;
    util.http({
      url: url,
      dataForm: {
        varType: 'spendable_point',
        varKey: 'spendable_point_deduction'
      },
      success: ({ data }) => {
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
  getPriceByDiscount(num) {
    let totalPrice = parseFloat(this.data.detailInfo.price * num).toFixed(2);
    let payPrice = totalPrice;
    if (this.data.discount * this.data.discountRate > totalPrice) {  // 抵扣金额大于总额
      this.dialogShow('抵扣金额大于支付总额');
      this.setData({ discount: 0 })
    }
    if (this.data.discount) {
      payPrice = parseFloat(this.data.detailInfo.price * num - this.data.discount * this.data.discountRate).toFixed(2)
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
    if (discount > spendablePoint) {
      this.dialogShow('抵扣积分已超过可用积分');
      this.setData({ discount: 0 })
    }
    else {
      this.setData({ discount });
    }
    // let discount = e.detail.value;
    // this.setData({ discount });
    // if (discount > this.data.spendablePoint) {
    //   this.dialogShow('抵扣积分已超过可用积分');
    //   this.setData({ discount: 0 })
    // }
    this.getPriceByDiscount(this.data.carNum);
  },
  submit() {
    if (!this.data.beginDate) { this.dialogShow('请先选择日期'); return false; }
    if (!this.data.name) { this.dialogShow('请先填写姓名'); return false; }
    if (!this.data.mobile) { this.dialogShow('请先填写手机号'); return false; }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) { this.dialogShow('手机号不合法'); return false; }
    // if (this.data.discount > this.data.spendablePoint) { this.dialogShow('抵扣积分已超过可用积分'); return false; }
    // if (this.data.discount * this.data.discountRate > this.data.totalPrice) { this.dialogShow('抵扣金额大于支付总额'); return false; }
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
  forbidPay() {
    wx.showToast({ title: '余额不足', image: '../../images/warn.png', duration: 1000 });
  },
  confirmBtn() {
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let arr = [{
      productId: this.data.id,
      productType: this.data.linkType,
      productName: this.data.detailInfo.name,
      nums: this.data.carNum,
      price: this.data.detailInfo.price
    }]
    wx.setStorageSync('name', this.data.name)
    wx.setStorageSync('mobile', this.data.mobile)
    let url;
    let startTravelDate = (new Date(this.data.beginDate)).getTime();
    let param = {
      trueName: this.data.name,
      mobile: this.data.mobile,
      bookStartDate:'',
      bookEndDate:'',
      startTravelDate: startTravelDate,
      orderType: this.data.linkType,
      spendablePoint: this.data.discount ? this.data.discount : 0,
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
            this.setData({ wayShow: false })
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
    // 计算价格
    let beginDate = this.data.beginDate;
    let totalPrice = parseFloat(this.data.detailInfo.price * this.data.carNum).toFixed(2);
    let payPrice = totalPrice;
    if (this.data.discount) {
      payPrice = parseFloat(this.data.detailInfo.price * this.data.carNum - this.data.discount * this.data.discountRate).toFixed(2)
    }
    this.setData({
      calendarShow: false,
      beginDate,
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
    let startTime = (new Date(startDate[0], startDate[1] - 1, startDate[2], startDate[3], startDate[4], startDate[5])).getTime();
    let endTime = (new Date(endDate[0], endDate[1] - 1, parseInt(endDate[2]) + 1, endDate[3], endDate[4], endDate[5])).getTime();
    days.forEach(function (item) {
      let cur_time = (new Date(year, month - 1, item.day, '23', '59', '59')).getTime();
      if (cur_time < toTime || cur_time > endTime || cur_time < startTime ) {
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
      days.forEach((item)=>{
        item.choosed = false;
      })
      days[idx].choosed = true;
      this.data.beginDate = this.data.cur_year + '-' + this.dateForm(this.data.cur_month) + '-' + this.dateForm(days[idx].day)
      this.setData({
        choose_year: this.data.cur_year,
        choose_month:this.data.cur_month,
        choose_day:days[idx],
        days:days
      })
    }
    else {
      wx.showToast({ title: '当前日期不可选', image: '../../images/warn.png', duration: 2000 })
    }
  },
  clear() {
    this.setData({
      choose_year:'',
      choose_month:'',
      choose_day:'',
      beginDate: '',
      totalPrice:0,
      payPrice:0
    })
    this.calculate();
  },
})