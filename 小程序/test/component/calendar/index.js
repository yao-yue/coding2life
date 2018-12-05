// component/calendar/index.js
Component({
  properties: {
    calendarShow: {
      type: Boolean,
      value: false,
    },
    beginDate: {
      type: String,
      value: '',
    },
    endDate: {
      type: String,
      value: '',
    },
    dayNum: {
      type: String,
      value: '',
    },
    init: {
      type: Object
    }
  },
  data: {
    // 日历选择器
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
  },
  ready: function () {
    console.log('123');
    // this.calculate();
  },
  methods: {
    // init(){
    //   this.trigger
    // },
    //日历插件 
    calculate() {
      this.setData({
        calendarShow: true
      })
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
      this.calculateDays(cur_year, cur_month, cur_day);
      // 日历插件  finished 
    },
    submitDate() {
      if (!this.data.dayList.length) {
        this.setData({
          calendarShow: false,
          beginDate: '',
          endDate: '',
          dayNum: '',
          date: '日期',
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
        date: '日期'
      });
      this.initDayList(cur_year, cur_month, cur_day);
      this.calculateEmptyGrids(cur_year, cur_month);
      this.calculateDays(cur_year, cur_month, cur_day);
      console.log(this.data.days);
    },
  }
})