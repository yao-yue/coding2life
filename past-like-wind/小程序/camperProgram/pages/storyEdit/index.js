// pages/storyEdit/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    imagesList: [],
    msgType: '',   // 分类
    msgAddress:'你在哪里？',
    sortList: ['景点', '美食', '文化', '活动'],
    sortKey: ['SCENERY', 'FOOD', 'CULTURE','ACTIVITY'],
    sortIndex: '',
    msgTitle:'',
    msgContent:'',
    msgCity:'',
    btnClick:true,
  },
  onLoad: function (options) {

  },
  titleBind(e){
    this.data.msgTitle = e.detail.value;
  },
  contentBind(e){
    this.data.msgContent = e.detail.value;
  },
  sortBind(e){
    this.setData({
      sortIndex: e.detail.value
    })
    this.data.msgType = this.data.sortKey[e.detail.value];
  },
  addImage() {
    let that = this;
   // console.log(this.data.imagesList.length);
    let count = parseInt(8 - this.data.imagesList.length);
   // console.log(count);
    wx.chooseImage({
      count: count, // 默认8
      success: (res) => {
        let tempFilePaths = res.tempFilePaths,
          tempFiles = res.tempFiles;
        for (let i = 0; i < tempFilePaths.length; i++) {
          let filePath = tempFilePaths[i],
            file = tempFiles[i];
          this.uploadFile(filePath, file);
        }
      }
    })
  },
  //上传文件
  uploadFile: function (path, file) {
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
        let item = JSON.parse(res.data);
        if (item.status == 401) {
          wx.redirectTo({
            url: '../login/index',
          })
          return false;
        }
        if (item.status != 200) {
          wx.showToast({
            content: '上传失败',
            image: '../../images/fail.png'
          })
          return false;
        }
        that.data.imagesList.push(item.data.bussData);
        that.setData({
          imagesList: that.data.imagesList
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
  deleteImage(e) {
    let index = e.currentTarget.dataset.index;
    let imagesList = this.data.imagesList;
    imagesList.splice(index, 1);
    this.setData({
      imagesList: imagesList
    })
  },
  getAddress(){
    wx.chooseLocation({
      type: 'wgs84',
      success: (res)=> {
        console.log(res);
        let address = res.address;
        let name = res.name;
        let listOne = address.split('省');
        let listTwo = listOne[1] ? (listOne[1].split('市') ? listOne[1].split('市') : listOne[1].split('区') ? listOne[1].split('区'):[]):[];
        this.data.msgCity = listTwo[0] ? listTwo[0] : listOne[1] ? listOne[1] : address;
        console.log(this.data.msgCity);
        this.setData({
          msgAddress: res.name
        })
      },
      fail:(res)=>{
        console.log(res);
        if (res.errMsg == 'chooseLocation:fail auth deny'){
          this.getAccess('小程序需要获取定位，点击确认前往设置')
        }
        else{
          console.log(res.errMsg);
        }
      },
    })
  },
  getAccess: function (text) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: text,
            confirmText: '确认',
            cancelText: '取消',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    console.log(res);
                    if (res.authSetting['scope.userLocation']) {
                      wx.showToast({ title: '开启成功', icon: 'success', duration: 1500 })
                      that.getAddress();
                    }
                    else {
                      that.getAccess('关闭授权可能会无法使用小程序部分功能，可点击确认前往重新开启设置');
                    }
                  }
                });
              }
            }
          })
        }
        else {
          console.log('已获取用户权限');
        }
      }
    })
  },
  submit() {
    let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if (!this.data.msgTitle) {
      this.dialogShow('标题不能为空')
      return false;
    }
    if (!this.data.msgContent) {
      this.dialogShow('内容不能为空')
      return false;
    }
    if (this.data.msgTitle.match(regRule) || this.data.msgContent.match(regRule)) {
      this.dialogShow('禁止存在表情')
      return false;
    }
    if (!this.data.imagesList.length) {
      this.dialogShow('请上传图片')
      return false;
    }
    if (this.data.msgAddress == '你在哪里？') {
      this.dialogShow('请选择定位')
      return false;
    }
    if (!this.data.msgType) {
      this.dialogShow('请选择分类')
      return false;
    }
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let url = API.URL.CAR.ADDINFOMSG;
    let imagesList = this.data.imagesList;
    let dataForm = {
      msgTitle: this.data.msgTitle,
      msgContent: this.data.msgContent,
      msgType: this.data.msgType,
      msgAddress: this.data.msgAddress,
      msgCity: this.data.msgCity
    }
    imagesList.forEach((item, index) => {
      dataForm['images[' + index + '].fileId'] = item.fileId;
      dataForm['images[' + index + '].fileKey'] = item.fileKey;
      dataForm['images[' + index + '].fileName'] = item.fileName;
      dataForm['images[' + index + '].fileUrl'] = item.fileUrl;
      dataForm['images[' + index + '].targetType'] = item.targetType;
    });
    util.http({
      url: url,
      dataForm: dataForm,
      success: (res) => {
        console.log(res);
        this.data.btnClick = true;
        if (res.status == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../storyCircle/index'
            })
          }, 1500)
        }
        else {
          wx.showToast({
            title: res.msg,
            duration: 1500,
            image: '../../images/fail.png'
          })
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: res.msg,
          duration: 1500,
          image: '../../images/fail.png'
        })
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
    setTimeout(() => {
      this.setData({
        dialogText: ''
      })
    }, 2000)
  },
})