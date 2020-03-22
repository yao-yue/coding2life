// pages/subleaseAuditSave/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    oneShow:true,
    twoShow:true,
    frontId: 0,
    backId: 0,
    frontImageSrc: '',
    backImageSrc: '',
    btnClick:true,
  },
  onLoad: function (options) {
  
  },
  // 主要是用来选择图片以及上传图片
  choosePic(e) {
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        let tempFilePath = res.tempFilePaths[0],
            tempFile = res.tempFiles[0],
            idType = index == 0 ? 'frontId' : 'backId';
        this.upload(tempFilePath, tempFile, idType)
      }
    })
  },
  //上传文件
  upload: function (path, file, idType) {
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
      success: function (res) {
        console.log(res, 'fff')
        let item = JSON.parse(res.data);
        if (item.status != 200) {
          wx.showToast({
            content: '上传失败',
            image: '../../images/fail.png'
          })
          return false;
        }
        console.log(item.data.bussData);
        if (idType == 'frontId') {
          var maskShowType = 'oneShow',
              imageKey = 'frontImageSrc';
        } else if (idType == 'backId') {
          var maskShowType = 'twoShow',
              imageKey = 'backImageSrc';
        }
        that.setData({
          [idType]: item.data.bussData.fileId,
          [maskShowType]: false,
          [imageKey]: item.data.bussData.fileUrl
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
  // 删除图片
  deletePic(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.setData({
        oneShow: true,
        frontId: 0,
        frontImageSrc: ''
      })
    } else if (index == 1) {
      this.setData({
        twoShow: true,
        backId: 0,
        backImageSrc: ''
      })
    }
  },

  // 提交信息
  submitCheck() {
    if (!this.data.name) {
      this.dialogShow('姓名不能为空')
      return;
    }
    if (!this.data.mobile) {
      this.dialogShow('手机号不能为空')
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      this.dialogShow('手机号格式不对')
      return;
    }
    if (!this.data.code) {
      this.dialogShow('身份证号不能为空')
      return;
    }
    if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(this.data.code)) {
      this.dialogShow('身份证号格式不正确')
      return;
    }
    if (!this.data.frontId) {
      this.dialogShow('未上传正面照')
      return;
    }
    if (!this.data.backId) {
      this.dialogShow('未上传反面照')
      return;
    }
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let url = API.URL.USERAUTH.SAVEAUTH,
    param = {
      trueName: this.data.name,
      mobile: this.data.mobile,
      cardId: this.data.code,
      cardFront: this.data.frontId,
      cardBack: this.data.backId
    }
   // console.log(param);
    util.http({
      url: url,
      data: param,
      success: ({ data }) => {
        this.data.btnClick = true;
        wx.showToast({
          title: '已发送审核！',
          icon: 'success',
          complete () {
            wx.redirectTo({
              url: '../subleaseAuditStatus/index',
            })
          }
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
  bindNameInput (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindMobileInput (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindCodeInput (e) {
    this.setData({
      code: e.detail.value
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
  }
})