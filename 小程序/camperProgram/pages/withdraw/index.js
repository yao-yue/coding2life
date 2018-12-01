// pages/withdraw/index.js

const API = require('../../common/constant.js');
const util = require('../../utils/util');
const app = getApp();
Page({
  data: {
    balance: 0,
    bankCard:'',
    realName: '',
    bankCode: '',
    amount: '',
    bankList: [],
    dictList: [],
    bankIndex: '', 
    payWay: 'weixin',
    rate:'',
    btnClick:true,
  },
  onLoad: function (options) {
    let balance = options.balance;
    this.setData({
      balance
    })
    this.findDict();
    this.getVar();
  },
  findDict () {
    let url = API.URL.SYS.LOADDICTIONARY;
    util.http({
      url,
      dataForm: {codeType: 'bank'},
      success: (res) => {
        let resData = res.data.bussData,
            list = [];
        resData.forEach(e => {
          list.push(e.value);
        })
        this.setData({
          bankList: list,
          dictList: resData
        });
      },
      fail: (res) => {

      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  bankBind (e) {
    let bankIndex = parseInt(e.detail.value),
        bankCode = this.data.dictList[bankIndex]['key'];
    console.log(bankCode);
    this.setData({
      bankIndex,
      bankCode
    });
  },
  bankCardBind (e) {
    this.setData({
      bankCard: e.detail.value
    });
  },
  realNameBind (e) {
    this.setData({
      realName: e.detail.value
    });
  },
  amountBind (e) {
    this.setData({
      amount: e.detail.value
    });
  },
  changePayWay (e){
    let payWay = e.currentTarget.dataset.way;
    this.setData({
      payWay
    })
  },
  submitWithdraw () {
    if(!this.data.btnClick){
      return false;
    }
    let bankCard = this.data.bankCard,
        realName = this.data.realName,
        bankCode = this.data.bankCode,
        orderType = this.data.payWay,
        amount = this.data.amount,
        testexp = /^([1-9]{1})(\d{14}|\d{18})$/;
    if (!bankCard && orderType == 'bank') {
      wx.showToast({
        title: '请填写银行卡号！',
        image: '/images/warn.png'
      });
      return;
    }
    if (!testexp.test(bankCard) && orderType == 'bank') {
      wx.showToast({
        title: '卡号格式有误！',
        image: '/images/warn.png'
      });
      return;
    }
    if (!realName && orderType == 'bank') {
      wx.showToast({
        title: '请填写持卡人姓名！',
        image: '/images/warn.png'
      });
      return;
    }
    if (!bankCode && orderType == 'bank') {
      wx.showToast({
        title: '请选择银行！',
        image: '/images/warn.png'
      });
      return;
    }
    if (!amount) {
      wx.showToast({
        title: '请填写提现金额！',
        image: '/images/warn.png'
      });
      return;
    }
    let url = API.URL.SYS.SAVEPAYORDERWITHDRAW;
    if (orderType == 'weixin') {
      var param = {
        withdrawPrice: amount,
        channel: orderType,
        pointType: 'coins'
      };
    } else {
      var param = {
        withdrawPrice: amount,
        channel: orderType,
        account: bankCard,
        trueName: realName,
        bankCode,
        pointType: 'coins'
      };
    }
    this.data.btnClick = false;
    util.http({
      url,
      data: param,
      success: (res) => {
        this.data.btnClick = true;
        wx.showToast({
          title:'提现申请成功，请等待审核!',
          icon: 'success',
          duration:1500
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          });
        },1500)
      },
      fail: (res) => {
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png'
        })
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  getVar() {
    let url = API.URL.SYS.FINDDISCOUNTRULE;
    util.http({
      url: url,
      dataForm: {
        varType: 'coins_withdraw',
        varKey: 'charge_rate'
      },
      success: ({ data }) => {
        // console.log(bussData);
        this.setData({
          rate: data.bussData ? data.bussData.varValue : 0.00
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
})