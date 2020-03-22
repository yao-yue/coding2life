// pages/storyCommentList/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    pageIndex: 1,
    dataList: [],
    scrollShow: false,
    pageCount: 0,
    id: '',
    productType: '',
    noMoreShow: false,
    dialogShow:false,
    dialogText:'回复',
    name:'',
    parentIndex:'',
    childIndex:'',
    level:'',
  },
  onLoad: function (options) {
    this.data.id = options.id;
  },
  onShow: function (options) {
    if (this.data.pageCount == this.data.pageIndex) return
    this.getList()
  },
  getList() {
    let url = API.URL.CAR.FINDINFOMSGREPLYBYPAGE;
    util.http({
      url: url,
      dataForm: {
        pageIndex: this.data.pageIndex,
        pageSize: 10,
        msgId: this.data.id,
      },
      success: ({ data }) => {
        this.setData({
          dataList: this.data.dataList.concat(data.bussData),
          pageCount: data.pageCount
        })
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.scrollShow) return;
    if (this.data.pageCount <= this.data.pageIndex) {
      this.setData({
        noMoreShow: true
      })
      return false;
    }
    this.data.pageIndex++;
    this.data.scrollShow = false;
    this.getList()
  }, 
  linkTo(e) {
    if (!wx.getStorageSync('sessionId') || !wx.getStorageSync('userId')) {  // 未登录
      wx.navigateTo({
        url: '../login/index'
      })
      return false;
    }
    let commentType = e.currentTarget.dataset.commenttype;
    if(commentType == 'add'){
      wx.navigateTo({
        url: `../storyComment/index?id=${this.data.id}&commentType=add`
      })
    }
    else{
      console.log(e.currentTarget.dataset);
      let parentIndex = e.currentTarget.dataset.index;
      this.data.parentIndex = parentIndex;  // 父级index
      let level  = e.currentTarget.dataset.level;
      this.data.level = level;
      let selfId = wx.getStorageSync('userId');
      let userId = '';
      if(level == 'parent'){   // 此条是评论
        let dataList = this.data.dataList;
        this.data.parentId = dataList[parentIndex].parentId;
        this.data.name = dataList[parentIndex].userName;
        this.data.replyId = dataList[parentIndex].id;
        userId = dataList[parentIndex].userId;
      }
      else { // 此条是回复
        this.data.childIndex = e.currentTarget.dataset.child;  //  子级 index
        this.data.parentId = e.currentTarget.dataset.parent;
        this.data.name = e.currentTarget.dataset.name;
        this.data.replyId = e.currentTarget.dataset.id;
        userId = e.currentTarget.dataset.user;
      }
      console.log(selfId);
      console.log(userId);
        if(userId == selfId){  // 本人的评论
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
    }  
  },
  handleReply(){
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
    if (this.data.dialogText == '删除'){
      wx.showModal({
        title: '提示',
        content: '您真的想要删除此评论吗？',
        confirmText: '确认',
        cancelText: '取消',
        showCancel: true,
        success:(res) =>{
          if (res.confirm) {
            this.deleteComment();
          }
        }
      })
    }
    else{
      wx.navigateTo({
        url: `../storyComment/index?id=${this.data.id}&commentType=reply&parentId=${this.data.replyId}&name=${this.data.name}`
      })
    }
  },
  deleteComment(){
    let url = API.URL.CAR.DELETEINFOMSGREPLY;
    util.http({
      url: url,
      dataForm: {
        replyId: this.data.replyId,
      },
      success: (res) => {
        if(res.status == 200){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
          let dataList = this.data.dataList;
          if (this.data.level == 'parent') {   // 此条是评论
            let parentIndex = parseInt(this.data.parentIndex);
            dataList.splice(parentIndex, 1);
          }
          else{
            let parentIndex = parseInt(this.data.parentIndex);
            let childIndex = parseInt(this.data.childIndex);
            dataList[parentIndex].replyList.splice(childIndex, 1);
          }
          this.setData({
            dataList
          }) 
        }
        else{
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
})