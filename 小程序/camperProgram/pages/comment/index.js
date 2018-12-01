// pages/comment/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    imagesList: [],
    textarea: '',
    orderType: 'rv_rent',
    orderId: '',
    dialogText: '',
    replyTypeList:{
      rv_rent:'rent',
      hotel_product: 'hotel',
      campbase_product: 'campbase',
      line_product:'line'
    },
    replyType:'',
    btnClick:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.data.orderType = e.orderType;
    this.data.orderId = e.orderId;
    this.data.replyType = this.data.replyTypeList[e.orderType];
    console.log(this.data.replyType );
  },
  addImage() {
    let that = this;
    console.log(this.data.imagesList);
    wx.chooseImage({
      count: 9, // 默认9
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
        if(item.status == 401){
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
  deleteImage(e){
    let index = e.currentTarget.dataset.index;
    let imagesList = this.data.imagesList;
    imagesList.splice(index,1);
    this.setData({
      imagesList: imagesList
    })
  },
  textareaTxt(e) {
    this.data.textarea = e.detail.value
  },
  submitList() {
    let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if (!this.data.textarea) {
      this.dialogShow('评论不能为空')
      return false;
    }
    if (this.data.textarea.match(regRule)) {
      this.dialogShow('评论禁止存在表情')
      return false;
    }
    if (!this.data.btnClick) return;
    this.data.btnClick = false;
    let url = API.URL.ORDER.SAVEORDERREPLY;
    let imagesList = this.data.imagesList;
    let dataForm = {
      orderId: this.data.orderId,
      replyType: this.data.orderType,
      comments: this.data.textarea,
      // images: this.data.imagesList
    }
    imagesList.forEach((item,index)=>{
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
        if(res.status == 200){
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url:'../myOrder/index?orderType='+this.data.orderType
            })
          }, 1000)
        }
        else{
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