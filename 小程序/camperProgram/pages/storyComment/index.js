// pages/storyComment/index.js
// pages/comment/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'说点什么(100字以内)...',
    textarea: '',
    dialogText: '',
    parentId:'',
    id:'',
    btnClick:true,
  },
  onLoad: function (options) {
    console.log(options);
    this.data.id = options.id;
    this.data.parentId = options.parentId,
   //  this.data.name = options.name ? options.name : '',
    this.data.commentType = options.commentType;
    if (options.commentType == 'add'){
      this.setData({
        placeholder: '说点什么(100字以内)...'
      })
    }
    else{
      this.setData({
        placeholder: '回复' + options.name +':'
      })
    }
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
    let url = API.URL.CAR.ADDINFOMSGREPLY;
    let dataForm = {
      msgId: this.data.id,
      replyInfo: this.data.textarea,
    }
    if (this.data.parentId){
      dataForm.parentId = this.data.parentId;
    }
    util.http({
      url: url,
      dataForm: dataForm,
      success: (res) => {
        console.log(res);
        this.data.btnClick = true;
        if (res.status == 200) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../storyCommentList/index?id=' + this.data.id
            })
          }, 1000)
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