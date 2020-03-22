// pages/subleaseSettings/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    productId: 0,
    subleaseInfo: {},
    price: 0.00,
    modalShow: false,
    rechargeType: 'protocal',
    detailInfo: '',
    countKey: 300,
    dialogText: '',
    shareShow:false,
    protocalShow: true,
    balance: 0,
    totalPrice: 300,          //总价
    payWay: 0,                //支付方式，默认为0，weixin: 微信支付 ， coins: 余额支付
    wayShow: false,
    read: false,
    tip: '',
    rechargeCount:1,
    rechargeAmount: 300,
    forbid:false,
    inputShow:false,
    btnClick:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      productId: id
    })
    this.checkProtocalStatus(id);
    this.getTip();
    this.getSubleaseInfo(id);
    this.getUserInfo();
  },
  checkProtocalStatus (id) {
    let url = API.URL.USERRENT.CHECKUSERRENT;
    util.http({
      url: url,
      dataForm: {
        id
      },
      success: ({ data }) => {
        var flag = data.bussData.isShow == 'y' ? true : false;
        this.setData({
          protocalShow: flag
        })
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
  getSubleaseInfo (id) {
    let url = API.URL.USERRENT.FINDUSERRENTPRODUCTBYID;
    util.http({
      url: url,
      dataForm: {
       id
      },
      success: ({ data }) => {
        let resData = data.bussData;
        this.setData({
          subleaseInfo: resData,
          rerentId: resData.id,
          price:resData.price?resData.price:0
        })
        this.getUserInfo();
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
  getUserInfo() {
    let url = API.URL.USERPRODUCT.FINDUSERDETAIL;
    util.http({
      url: url,
      success: ({ data }) => {
        let resData = data.bussData;
        if(resData.balance == 0){
          this.setData({
            balance: resData.balance,
            forbid:true
          })
        }
        else{
          this.setData({
            balance: resData.balance
          })
        }
        
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
  bindPriceInput (e) {
    let price = e.detail.value;
    if (price.indexOf('.') != -1 && price.split('.')[1].length > 2){
      this.setData({
        price: this.data.price
      })
    }
    else{
      this.data.price = e.detail.value;
    }
  },
  saveSubleasePrice () {
    if (!this.data.price) {
        this.dialogShow('价格');
        return;
    }
    let url = API.URL.USERRENT.UPDATEUSERRENTPRICE,
    id = this.data.productId,
    price= this.data.price;
    util.http({
      url: url,
      data: {
        id,
        price
      },
      success: ({ data }) => {
        wx.showToast({
          title: '保存成功！',
          icon: 'success'
        })
        this.setData({
          price:price
        })
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
  navigatePage (e) {
    wx.navigateTo({
      url: `/pages/subleaseDetail/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  shareTo(){
    this.setData({
      shareShow:true
    })
  },
  calcelLease(){
    this.setData({
      shareShow: false
    })
  },
  /* 保存到本地  */
  saveCode(){
    this.setData({
      shareShow: false
    })
    wx.downloadFile({
      url: this.data.subleaseInfo.qrCodeUrl,
      success: function (res) {
        wx.showLoading({
          title: '正在保存...',
          mask: true
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '图片已保存至相册',
              icon: 'success',
              duration: 3000
            })
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res.errMsg);   // saveImageToPhotosAlbum:fail auth deny
            if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {   // 拒绝授权
              that.getAccess('小程序需要开启保存分享图片到本地相册权限，点击确认前往设置');
            }
            else {
              console.log('出错？？？');
            }
          }
        });  // saveImageToPhotosAlbum
      }
    })  // download
  },
  getAccess: function (text) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '提示',
            content: text,
            confirmText: '确认',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting['scope.writePhotosAlbum']) {
                      that.data.isAccess = true;
                      wx.showToast({ title: '开启成功', icon: 'success', duration: 1500 })
                    }
                    else {
                      that.getAccess('关闭授权可能会无法使用保存分享图片到本地相册功能，可点击确认前往重新开启设置');
                    }
                  }
                });
              }
              else if (res.cancel) {
                wx.showModal({
                  title: '提示',
                  content: '您已取消授权,如需使用生成分享图功能请重新授权',
                  showCancel: false
                })
              }
            }
          })
        }
        else {
          console.log('已经授权啦~~')
        }
      }
    })
  },

  // 协议弹窗
  getTip() {
    let url = API.URL.ADV.FINDRERENTAGREEMENT;
    util.http({
      url: url,
      success: ({ data }) => {
        console.log(data);
        this.setData({
          tip: data.bussData.varValue
        })
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
  readClick() {
    this.setData({
      read: !this.data.read
    })
  },

  submitOrder(e) {
    if (e.currentTarget.dataset.recharge == 'protocal' && !this.data.read) {
      this.dialogShow("请同意此协议");
      return;
    }
    let rechargeType = e.currentTarget.dataset.recharge;
    this.setData({
      wayShow: true,
      rechargeType
    })
  },
  changePayWay(e) {  // 切换支付方式
    let payWay = e.currentTarget.dataset.id;
    this.setData({
      payWay: payWay
    });
  },
  close() {
    this.setData({
      wayShow: false
    })
  },

  // 确认支付
  confirmBtn() {
    if (!this.data.btnClick){
      return false;
    }
    let url = API.URL.CAMPPAY.DIRECTPAY,
        type = this.data.payWay,
        nums = this.data.rechargeCount,
        param = {
          reRentId: this.data.productId,
          countKey: 'k_300',
          nums,
          payType: type,
          orderType: 'view_count'
        };
    if (type == 0) {
      this.dialogShow('请先选择付款方式');
      return
    }
    this.data.btnClick = false;
    util.http({
      url: url,
      data: param,
      success: (data) => {
        if (type == 'weixin') {
          this.payRequest(data.data.bussData)
        } else {
          if (data.status == 200) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500
            })
            this.data.btnClick = true;
            let id = this.data.productId;
            this.getSubleaseInfo(id);
            this.setData({
              protocalShow: false,
              wayShow: false,
              rechargeCount:1,
              rechargeAmount:300.00,           
            })
          } else {
            this.dialogShow(data.msg);
            this.data.btnClick = true;
          }
        }
      },
      fail: (res) => {
        // console.log(res)
        this.dialogShow(res.msg);
        this.setData({
          wayShow: false
        })
        this.data.btnClick = true;
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
          let id = that.data.productId;
          that.getSubleaseInfo(id);
          that.setData({
            protocalShow: false,
            wayShow: false,
            rechargeCount: 1,
            rechargeAmount: 300.00, 
          })
          that.data.btnClick = true;
        },
        'fail': (res) => {
          wx.showToast({
            title: '支付取消',
            duration: 1500,
            image: '../../images/fail.png'
          })
          this.setData({
            wayShow: false
          })
          that.data.btnClick = true;
        }
      })
  },
  bindCountInput(e) {
    var count = e.detail.value < 1 ? 1 : e.detail.value,
        amount = count * 300;
    if (amount >= this.data.balance) {
      this.setData({ forbid: true })
    }
    this.setData({
      rechargeCount: count,
      rechargeAmount: amount
    })
  },
  minusCount () {
    var count = this.data.rechargeCount - 1 < 1 ? 1 : this.data.rechargeCount - 1,
    amount = count * 300;
    if(amount >= this.data.balance){
      this.setData({ forbid: true})
    }
    this.setData({
      rechargeCount: count,
      rechargeAmount: amount
    })
  },
  addCount () {
    var count = this.data.rechargeCount + 1,
      amount = count * 300;
    if (amount >= this.data.balance) {
      this.setData({ forbid: true })
    }
    this.setData({
      rechargeCount: count,
      rechargeAmount: amount
    })
  },
})
 

