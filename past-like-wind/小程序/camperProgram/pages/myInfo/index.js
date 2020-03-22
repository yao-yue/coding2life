// pages/myInfo/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    detailInfo:'',
    sexList: ['女', '男'],
    dialogText: '',
    btnClick:true,
    date:''
  },
  onLoad: function (options) {
    let date = (new Date()).toISOString().split('T')[0];
    this.setData({
      date
    })
    // console.log(date);
    this.getInfo();
  },
  nameBind(e) {
    this.data.detailInfo.nickname = e.detail.value
  },
  trueNameBind(e) {
    this.data.detailInfo.trueName = e.detail.value
  },
  sexBind(e) {
    this.data.detailInfo.sex = e.detail.value
    this.setData({
      detailInfo: this.data.detailInfo
    })
  },
  birthBind(e){
    this.data.detailInfo.birthday = e.detail.value
    this.setData({
      detailInfo: this.data.detailInfo
    })
  },
  linkTo(e) {
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: `../${path}/index`
    })
  },
  getInfo() {
    let url = API.URL.USERPRODUCT.FINDUSERDETAIL;
    util.http({
      url: url,
      success: ({ data }) => {
        this.setData({
          detailInfo: data.bussData
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
  addImage: function () {
    let that = this;
    console.log(this.data.imagesList);
    wx.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0],
          temFile = res.tempFiles[0];
        that.upload(tempFilePaths, temFile)
      }
    })
  },
  //上传文件
  upload: function (path, file) {
    let that = this,
      openId = wx.getStorageSync('openId'),
      id = wx.getStorageSync('sessionId')
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });
    wx.uploadFile({
      url: API.URL.SYS.UPLOAD + '?openId=' + openId + '&sessionId=' + id,
      filePath: path,
      name: 'file',
      formData: {
        'file': file
      },
      success: (res) => {
        let item = JSON.parse(res.data);
        if (item.status != 200) {
          wx.showToast({
            content: '上传失败',
            image: '../../images/fail.png'
          })
          return false;
        }
        console.log(item.data.bussData.fileUrl)
        this.data.detailInfo.avatarUrl = item.data.bussData.fileUrl;
        this.data.detailInfo.attachmentId = item.data.bussData.fileId
        this.setData({
          imagesList: this.data.imagesList,
          detailInfo: this.data.detailInfo
        })
      },
      fail: function (e) {
        console.log(e)
        wx.showToast({
          content: '上传失败',
          image: '../../images/fail.png'
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },
  submit() {
    if (!this.data.btnClick){
      return false;
    }
    this.data.btnClick = false;
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    let url = API.URL.USERPRODUCT.SAVEUSERDETAIL;
    util.http({
      url: url,
      data: {
        attachmentId: this.data.detailInfo.attachmentId,
        nickname: this.data.detailInfo.nickname,
        trueName: this.data.detailInfo.trueName,
        sex: this.data.detailInfo.sex,
        birthday: this.data.detailInfo.birthday
      },
      success: ({ data: { bussData } }) => {
        this.data.btnClick = true;
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '../myCenter/index',
          })
        },1500)
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
})