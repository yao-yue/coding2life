// pages/storyDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    detailInfo:{},
    images:[],
    replys:[],
    // 评论回复 删除
    dialogShow: false,
    dialogText: '回复',
    name: '',
    replyIndex: '',
    replyId:'',
    status:'',
  },
  onLoad: function (options) {
    this.setData({
      status:options.status
    })
    if (options.status == 'on') {
      wx.setNavigationBarTitle({
        title: '游记详情'
      });
    }
    else{
      wx.setNavigationBarTitle({
        title: '故事详情'
      });
    }
    this.data.id = options.id; 
  },
  onShow(){
    this.getDetail(this.data.id);
  },
  getDetail(id) {
    let userId = wx.getStorageSync('userId') ? wx.getStorageSync('userId'):'';
    let param = {
      id: id
    }
    if(userId){
      param.userId = userId;
    }
    let url = API.URL.CAR.FINDINFOMSGBYID;
    util.http({
      url: url,
      dataForm:param,
      success: ({ data: { bussData } }) => {
        if (bussData.otherInfoSpaceMsg && bussData.otherInfoSpaceMsg.length){
          bussData.otherInfoSpaceMsg.forEach((item) => {
            if (item.msgCity.length && item.msgCity.length > 4) {
              item.msgCity = item.msgCity.charAt(0) + item.msgCity.charAt(1) + item.msgCity.charAt(2) + item.msgCity.charAt(4) + '...';
            }
          })
        }
        let replyList = bussData.replyList;
        if (replyList.length){
          replyList.forEach((parent,parentIndex) => {
            if (parent.replyList.length){
              parent.replyList.forEach((child)=>{
                replyList.splice(parentIndex+1,0,child);
              })
            }
          })
        }
        bussData.replyList = replyList;
        var that = this;
        WxParse.wxParse('article', 'html', bussData.msgContent, that, 10);
        // console.log(replyList);
        this.setData({
          detailInfo: bussData,
        })
      },
      fail: (res) => {
        console.log('fail');
      },
      revertBack: () => {
        this.getLeaseDetail(this.data.id);
      }
    })
  },
  linkToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../storyDetail/index?id=${id}`
    })
  },
  linkToComment(){
    wx.navigateTo({
      url: `../storyCommentList/index?id=${this.data.detailInfo.id}`
    })
  },
  addComment(){
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    wx.navigateTo({
      url: `../storyComment/index?id=${this.data.detailInfo.id}&commentType=add`
    })
  },
  hit(){
    if(!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')){
      wx.navigateTo({
        url: '../login/index',
      })
      return false;
    }
    let url = API.URL.CAR.HITMSGBYID;
    util.http({
      url: url,
      dataForm: {
        msgId: this.data.detailInfo.id
      },
      success: (res) => {
        if(res.status = 200){
          //this.getDetail(this.data.id);
          if (this.data.detailInfo.isHit){  // 取消点赞
            this.data.detailInfo.hitCount = parseInt(this.data.detailInfo.hitCount)-1;
          }
          else{
            this.data.detailInfo.hitCount = parseInt(this.data.detailInfo.hitCount) + 1;
          }
          this.data.detailInfo.isHit = !this.data.detailInfo.isHit;
          this.setData({
            detailInfo: this.data.detailInfo
          })
        }
        else{
          wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
        }
      },
      fail: (res) => {
        console.log('fail');
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        // this.getLeaseDetail(this.data.id);
      }
    })
  },

  linkTo(e) {
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {
      wx.navigateTo({
        url: '../login/index',
      })
      return false;
    }
    this.data.replyIndex  = e.currentTarget.dataset.index;
    this.data.replyId = e.currentTarget.dataset.id;
    this.data.name = e.currentTarget.dataset.name;
    let userId = e.currentTarget.dataset.user;
    let selfId = wx.getStorageSync('userId');
    console.log(userId);
    console.log(selfId);
    if (userId == selfId) {  // 本人的评论
      this.setData({
        dialogText: '删除',
      })
    }
    else {  // 别人的评论
      this.setData({
        dialogText: '回复',
      })
    }
    this.setData({
      dialogShow: true,
    })
  },
  handleReply() {
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      this.setData({
        dialogShow: false
      })
      return false;
    }
    this.setData({
      dialogShow: false
    })
    if (this.data.dialogText == '删除') {
      wx.showModal({
        title: '提示',
        content: '您真的想要删除此评论吗？',
        confirmText: '确认',
        cancelText: '取消',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.deleteComment();
          }
        }
      })
    }
    else {
      wx.navigateTo({
        url: `../storyComment/index?id=${this.data.detailInfo.id}&commentType=reply&parentId=${this.data.replyId}&name=${this.data.name}`
      })
    }
  },
  deleteComment() {
    let url = API.URL.CAR.DELETEINFOMSGREPLY;
    util.http({
      url: url,
      dataForm: {
        replyId: this.data.replyId,
      },
      success: (res) => {
        if (res.status == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })

          let dataList = this.data.detailInfo.replyList;
          dataList.splice(parseInt(this.data.replyIndex), 1);
          this.data.detailInfo.replyList = dataList;
          this.setData({
            detailInfo
          })
        }
        else {
          wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 2000 });
        }
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  cancel() {
    this.setData({
      dialogShow: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '驴道房车',
      path: '/pages/storyDetail/index?id=' + this.data.detailInfo.id,
      success: function (res) {
        console.log('ok')
      },
      fail: function (res) {
        console.log('fail')
      }
    }
  },
})