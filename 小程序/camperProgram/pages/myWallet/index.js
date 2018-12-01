// pages/myWallet/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
const app = getApp();
Page({
  data: {
    balance: 0,
    point: 0,
    goodsList: [],
    rechargeNumber:0.00,
    amount:0.00,
    rechargeShow: false,
    // 抽奖
    awardShow:false,
    lotteryList:[
      { value: '一等奖', path: '../../images/noData.png', lotteryIndex: 1},
      { value: '二等奖', path: '../../images/noData.png', lotteryIndex: 2},
      { value: '三等奖', path: '../../images/noData.png', lotteryIndex: 3},
      { value: '八等奖', path: '../../images/noData.png', lotteryIndex: 8},
      { value: 'center', path: '../../images/noData.png', lotteryIndex: -1},
      { value: '四等奖', path: '../../images/noData.png', lotteryIndex: 4},
      { value: '七等奖', path: '../../images/noData.png', lotteryIndex: 7},
      { value: '六等奖', path: '../../images/noData.png', lotteryIndex: 6},
      { value: '五等奖', path: '../../images/noData.png', lotteryIndex: 5},
    ],
    last_index: 0,//上一回滚动的位置         
    amplification_index: 0, //轮盘的当前滚动位置         
    roll_flag: true,//是否允许滚动         
    max_number: 8,//轮盘的全部数量         
    speed: 300,//速度，速度值越大，则越慢 初始化为300         
    finalindex: 5,//最终的奖励         
    myInterval: "",//定时器         
    max_speed: 40,//滚盘的最大速度         
    minturns: 8,//最小的圈数为2         
    runs_now: 0,//当前已跑步数
    choosedShow:false,
    lotteryText:'立即抽奖',
  },
  onShow: function () {
    this.setData(this.data);
    this.getUserInfo();
    // this.getPointGoods();
    this.getLotteryList();
  },
  getUserInfo() {
    let url = API.URL.USERPRODUCT.FINDUSERDETAIL;
    util.http({
      url: url,
      success: (res) => {
        let resData= res.data.bussData;
        this.setData({
          balance: (resData.balance).toFixed(2),
          point: resData.spendablePoint.toFixed(2)
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
  getPointGoods() {
    let url = API.URL.POINT.FINDPOINTPRODUCT;
    util.http({
      url: url,
      dataForm:{
        status:'on'
      },
      success: (res) => {
        let resData = res.data.bussData;
        resData.forEach((item)=>{
          item.point = item.point.toFixed(2);
        })
        this.setData({
          goodsList: resData
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
  navigatePage (e) {
    let target = e.currentTarget.dataset.target,
        balance = this.data.balance;
    if (target == 'withdraw') {
      var query = '?balance=' + balance;
    }
    wx.navigateTo({
      url: `/pages/${target}/index${target == 'withdraw' ? query : ""}`
    });
  },

  rechargeInput (e) {
    let rechargeNumber = e.detail.value;
    if (rechargeNumber.indexOf('.') != -1 && rechargeNumber.split('.')[1].length > 2) {
      this.setData({
        rechargeNumber: this.data.rechargeNumber
      })
    }
    else {
      this.data.rechargeNumber = rechargeNumber;
    }
  
  },
  
  rechargePoints () {
    let points = this.data.rechargeNumber
    if (!points) {
      wx.showToast({
        title: '请输入金额！',
        image: '/images/warn.png'
      });
      return
    }
    let url = API.URL.CAMPPAY.DIRECTPAY,
        param = {
          points,
          payType: 'weixin',
          orderType: 'coins'
        };
    util.http({
      url: url,
      data: param,
      success: (res) => {
        let resData = res.data.bussData;
        this.payRequest(resData);
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
        this.setData({
          rechargeShow:false,
        })
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
          this.getUserInfo();
          that.setData({
            rechargeShow: false
          });
        },
        'fail': (res) => {
          wx.showToast({
            title: '支付取消',
            duration: 1500,
            image: '../../images/fail.png'
          });
          this.setData({
            rechargeShow: false,
          })
        }
      })
  },
  showRechargePanel () {
    this.setData({
      rechargeShow: true
    });
  },
  closeMask () {
    this.setData({
        rechargeShow: false
    });
  },
  getLotteryList(){
    let url = API.URL.LOTTERY.FINDLOTTERYPRIZELIST;
    util.http({
      url: url,
      data:{},
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
    })
  },
  drawLottery(){
    wx.showModal({
      title: '',
      content: '抽奖需要扣除20积分，确认抽奖？',
      confirmText: '确认',
      cancelText: '取消',
      showCancel: true,
      success:(res) =>{
        if(res.confirm){
          this.setData({ awardShow:true });
        }
      },
      fail:(res)=>{ console.log(res);}
    })
  },
  startrolling(){
    this.data.runs_now = 0;
    if(this.data.roll_flag){
      this.data.roll_flag = false;
      this.rolling();
    }
  },
  //滚动轮盘的动画效果       
  rolling: function (amplification_index) { 
    this.setData({
      choosedShow:false
    })            
    this.data.myInterval = setTimeout(()=>{ 
      this.rolling(); 
    }, this.data.speed );         
    this.data.runs_now++;   //已经跑步数加一         
    this.data.amplification_index++; //当前的加一         
    //获取总步数，接口延迟问题，所以最后还是设置成1s以上         
    var count_num = this.data.minturns * this.data.max_number + this.data.finalindex - this.data.last_index;         
    //上升期间         
    if (this.data.runs_now <= (count_num / 3) * 2) {           
      this.data.speed -= 30; 
      //加速           
      if (this.data.speed <= this.data.max_speed) {             
        this.data.speed = this.data.max_speed;   //最高速度为40；           
      }         
    } 
    //抽奖结束         
    else if (this.data.runs_now >= count_num) {           
      clearInterval(this.data.myInterval);           
      this.data.roll_flag = true;  
      setTimeout(() => {
        this.setData({
          choosedShow: true,
          lotteryText:'再抽一次'
        })
      }, 100)           
    } 
    //下降期间         
    else if (count_num - this.data.runs_now <= 10) {           
      this.data.speed += 20;        
    }         
    //缓冲区间         
    else {           
      this.data.speed += 10;           
        if (this.data.speed >= 100) {             
          this.data.speed = 100;  //最低速度为100；           
        }         
    }         
    if (this.data.amplification_index > this.data.max_number) { //判定！是否大于最大数           
      this.data.amplification_index = 1;        
    }         
    this.setData(this.data);    
  },
  cancelLotter(){
    this.setData({
      awardShow:false
    })
  }
})