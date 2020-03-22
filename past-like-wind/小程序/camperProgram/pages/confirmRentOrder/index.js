// pages/confirmRentOrder/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    wayShow:false, // 支付方式
    wayPay: false,  //  true 余额支付；   false 微信支付
    // 时间选择
    timeList: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
    pickerArray: [],
    pickerIndex: [],
    returnArray:[],
    returnIndex: [],
    takeRentTime:'',
    returnRentTime:'',
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
    beginDate:'',
    endDate: '',
    dayNum:'',  // 日租
    month:'',   // 月租
    monthList: ['一个月(30天)', '二个月(60天)', '三个月(90天)'],
    monthDayList: [30,60,90],
    monthIndex:'',
    leasetype: '',  // 租赁方式  日租 或者 月租 
    // 提交表单
    carNum: 1,
    name:'',
    mobile:'',
    // 
    id:'',
    encrypt:'',
    detailInfo:{},
    totalPrice:0.00,
    discount:0.00,
    discountRate: '',
    payPrice:0.00,
    dayPrice:0.00,
    monthPrice:0.00,
    spendablePoint: '',
    balance: 0.00,
    btnClick:true,
  },
  onLoad: function (options) {
    if (options.encrypt) {  // 转租订单
      this.data.encrypt = options.encrypt;
      this.getDetailByEncrypt(options.encrypt);
    }
    else {
      this.getDetail(options.id)  // 房车租赁
    }
    this.data.id = options.id;
    this.setData({
      leasetype: options.leasetype ? options.leasetype : '',
      name: wx.getStorageSync('name') ? wx.getStorageSync('name') : '',
      mobile: wx.getStorageSync('mobile') ? wx.getStorageSync('mobile') : '',
    })
    // 初始化时间选择器
    let multiArray = [];
    multiArray.push(this.data.timeList);
    multiArray.push(this.data.timeList);
    this.setData({
      pickerArray: multiArray,
      returnArray: multiArray
    });
    this.getDiscount();
    this.getInfo();
    // 初始化日历插件
    this.calculate();
    
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
       // console.log(bussData);
        this.setData({
          discountRate: data.bussData?data.bussData.varValue:0.00
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
  //租赁详情
  getDetail(id) {
    let url = API.URL.CAR.FINDRENTINFOBYID;
    util.http({
      url: url,
      dataForm: {
        id: id
      },
      success: ({ data: { bussData } }) => {
        this.setData({
          detailInfo: bussData,
          dayPrice: bussData.price,
          monthPrice: bussData.monthPrice
        })
      },
      fail: (res) => {
        console.log('ffff');
      },
      revertBack: () => {
        this.getDetailt(this.data.id);
      }
    })
  },
  getDetailByEncrypt(encrypt) {
    let url = API.URL.CAR.FINDRENTINFOBYQRCODE;
    util.http({
      url: url,
      data: { encrypt: encrypt },
      success: ({ data: { bussData } }) => {
        this.setData({
          detailInfo: bussData,
          dayPrice: bussData.price,
        })
      },
      fail: (res) => {
        console.log('ffff');
      },
      revertBack: () => {
        this.getDetailByEncrypt(this.data.encrypt);
      }
    })
  },
  monthBind(e) {
    let month = e.detail.value +1;
    this.setData({
      month
    })
    let date = new Date();
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    let cur_day = this.dateForm(date.getDate());
    let beginDate = cur_year + '-' + this.dateForm(cur_month) + '-' + cur_day;
    let endDate = '';
    if (cur_month + this.data.month > 12){
      let month = cur_month + this.data.month - 12;
      endDate = (cur_year + 1) + '-' + this.dateForm(month) + '-' + cur_day;
    }
    else{
      let month = cur_month + this.data.month;
      endDate = cur_year + '-' + this.dateForm(month) + '-' + cur_day;
    }
    this.setData({
      monthIndex: e.detail.value,
      beginDate,
      endDate,
    });
    this.getPriceByNum(this.data.carNum);
  },
  bindPickerTimeChange(e){    
    console.log(e.detail.value);
    if (!this.data.dayNum && this.data.leasetype == 'day'){
      wx.showToast({ title: '请先选择日期', image: '../../images/warn.png', duration: 1000 });
      return false;
    }
    if (!this.data.month && this.data.leasetype == 'month') {
      wx.showToast({ title: '请先选择月数', image: '../../images/warn.png', duration: 1000 });
      return false;
    }
    let multiIndex = e.detail.value;
    if(multiIndex[0] <= multiIndex[1]){
      // {{beginDate}}  {{pickerArray[0][pickerIndex[0]]}}~{{pickerArray[1][pickerIndex[1]]}}  
      this.setData({ pickerIndex: multiIndex })     
      let takeRentTime = this.data.beginDate + ' ' + this.data.pickerArray[0][multiIndex[0]] + '~' + this.data.pickerArray[1][multiIndex[1]];
      this.setData({
        takeRentTime
      })
      // this.data.takeRentTime = takeRentTime;
    }
    else{
      wx.showToast({ title:'请选择合法时间', image: '../../images/warn.png', duration: 1000 });
      //this.dialogShow('开始时间不能小于结束时间');
    }
  },
  bindReturnTimeChange(e) {
    console.log(e.detail.value);
    if (!this.data.dayNum && this.data.leasetype == 'day') {
      wx.showToast({ title: '请先选择日期', image: '../../images/warn.png', duration: 1000 });
      return false;
    }
    if (!this.data.month && this.data.leasetype == 'month') {
      wx.showToast({ title: '请先选择月数', image: '../../images/warn.png', duration: 1000 });
      return false;
    }
    let multiIndex = e.detail.value;
    if (multiIndex[0] <= multiIndex[1]) {
      // {{endDate}}  {{returnArray[0][returnIndex[0]]}}~{{returnArray[1][returnIndex[1]]}}
      this.setData({ returnIndex: multiIndex })
      let returnRentTime = this.data.endDate + ' ' + this.data.returnArray[0][multiIndex[0]] + '~' + this.data.returnArray[1][multiIndex[1]];
      this.setData({
        returnRentTime
      })
      // this.data.returnRentTime = returnRentTime;
    }
    else {
      wx.showToast({ title: '请选择合法时间', image: '../../images/warn.png', duration: 1000 });
    }
  },
  changeCarNum(e) {
    let type = e.currentTarget.dataset.type;
    let num = this.data.carNum;
    if (type == 'plus') { num++; }
    else {
      if (num <= 1) {console.log('不能再减少了');}
      else {num--;}
    }
    this.getPriceByNum(num);
  },
  numberGet(e) {
    let num = e.detail.value < 1 ? 1 : e.detail.value;
    this.getPriceByNum(num);
  },
  getPriceByNum(num){
    let totalPrice = 0.00;
    if (this.data.leasetype == 'month') {  // 月租
      totalPrice = parseFloat(this.data.monthPrice * num * this.data.month).toFixed(2);
    }
    else {   // 日租
      totalPrice = parseFloat(this.data.dayPrice * num * this.data.dayNum).toFixed(2);
    }
    this.getPriceByDiscount(num, totalPrice);
  //  console.log(num, totalPrice);
  },
  getPriceByDiscount(num, totalPrice) {
    let payPrice = totalPrice;
    if (this.data.discount * this.data.discountRate > totalPrice) {  // 抵扣金额大于总额
      this.dialogShow('抵扣金额大于支付总额');
      this.setData({ discount: 0 })
    }
    if (this.data.discount) {
      if (this.data.leasetype == 'month'){
        payPrice = parseFloat(this.data.monthPrice * num * this.data.month - this.data.discount * this.data.discountRate).toFixed(2)
      }
      else{
        payPrice = parseFloat(this.data.dayPrice * num * this.data.dayNum - this.data.discount * this.data.discountRate).toFixed(2)
      }
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
    if (!this.data.dayNum && this.data.leasetype == 'day') {
      this.dialogShow('请先选择租赁日期'); return false;
    }
    if (!this.data.month && this.data.leasetype == 'month') {
      this.dialogShow('请先选择租赁月数'); return false;
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

    // 判断输入的积分抵扣值是否大于 totalPrice
    this.getPriceByNum(this.data.carNum);
  },
  submit() {
    if (!this.data.dayNum && this.data.leasetype == 'day') { this.dialogShow('请先选择日期'); return false; }
    if (!this.data.month && this.data.leasetype == 'month') { this.dialogShow('请先选择租赁月数'); return false; }
    if (!this.data.takeRentTime) { this.dialogShow('请先选择取车时间'); return false; }
    if (!this.data.returnRentTime) { this.dialogShow('请先选择还车时间'); return false; }
    if (!this.data.name) { this.dialogShow('请先填写姓名'); return false; }
    if (!this.data.mobile) { this.dialogShow('请先填写手机号'); return false; }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) { this.dialogShow('手机号不合法'); return false; }
    if (this.data.payPrice == 0) { this.dialogShow('付款金额需大于0'); return false; }
    this.setData({ wayShow: true });
  },
  modalClick() {
    this.setData({wayShow:false})
  },
  changePayWay(e) {
    let type = e.currentTarget.dataset.id;
    if (type == 'weixin') { this.setData({ wayPay: false }) }
    else { this.setData({ wayPay: true }) }
  },
  forbidPay(){
    wx.showToast({ title: '余额不足', image: '../../images/warn.png', duration: 1000 });
  },
  confirmBtn() {
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let arr = [{
      productId: this.data.id,
      productType: 'rv_rent',
      productName: this.data.detailInfo.rentName,
      nums: this.data.carNum,
      price: this.data.detailInfo.price
    }]
    wx.setStorageSync('name', this.data.name)
    wx.setStorageSync('mobile', this.data.mobile)
    let url,param;
    let bookStartDate = (new Date(this.data.beginDate)).getTime();
    let bookEndDate = (new Date(this.data.endDate)).getTime();
    if (this.data.leasetype == 'month') {  // 月租
      param = {
        isMonth: 'y',
        monthCount: this.data.month,
        trueName: this.data.name,
        mobile: this.data.mobile,
        takeRentTime: this.data.takeRentTime,
        returnRentTime: this.data.returnRentTime,
        orderType: 'rv_rent',
        spendablePoint: this.data.discount ? this.data.discount : 0,
        itemList: arr
      }
    }
    else {  // 日租
      let bookStartDate = (new Date(this.data.beginDate)).getTime();
      let bookEndDate = (new Date(this.data.endDate)).getTime();
      param = {
        bookStartDate: bookStartDate,
        bookEndDate: bookEndDate,
        trueName: this.data.name,
        mobile: this.data.mobile,
        takeRentTime: this.data.takeRentTime,
        returnRentTime: this.data.returnRentTime,
        orderType:'rv_rent',
        spendablePoint: this.data.discount ? this.data.discount : 0,
        itemList: arr
      }
      // 扫码 
      if (this.data.encrypt) {
        param.encrypt = this.data.encrypt;
      }
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
                url: '../myOrder/index?orderType=rv_rent'
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
                url: '../myOrder/index?orderType=rv_rent'
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
              url: '../myOrder/index?orderType=rv_rent'
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
    // // 计算价格
    // let totalPrice = parseFloat(this.data.dayPrice * dayNum * this.data.carNum).toFixed(2);
    // let payPrice = totalPrice;
    // if (this.data.discount) {
    //   payPrice = parseFloat(this.data.dayPrice * dayNum * this.data.carNum - this.data.discount * 1).toFixed(2)
    // }
    this.setData({
      calendarShow: false,
      beginDate: beginDate,
      endDate: endDate,
      dayNum: dayNum,
    });
    this.getPriceByNum(this.data.carNum);
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