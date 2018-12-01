// pages/subleaseDetail/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    id:'',
    pageIndex: 1,
    pageCount: '',
    noMoreShow: true,
    loading: true,
    scrollHeight: '',
    list:[]
  },
  onLoad: function (options) {
    let id = options.id;
    this.data.id = id;
    wx.getSystemInfo({
      success: (res) => {
        this.getList(id);
        this.setData({
          scrollHeight: parseInt(res.windowHeight)
        })
      }
    });
  },
  getList(id) {
    let url = API.URL.USERRENT.FINDUSERRENTDETAILBYPAGE;
    util.http({
      url: url,
      dataForm: {
        pageIndex: 1,
        pageSize: 10
      },
      data: {
        userRentId: id
      },
      success: (res) => {
        if (res.status == 200) {
          let bussData = res.data.bussData,
            pageCount = res.data.pageCount;
          let list = this.data.list.concat(bussData);
          this.setData({
            list: this.data.pageIndex <= pageCount ? list : this.data.list,
            pageCount: pageCount,
            pageIndex: this.data.pageIndex,
            loading: true
          })
          if (this.data.list.length == 0) {
            this.setData({
              scrollHeight: 'auto'
            })
          }
          if (pageCount == 1) {
            this.setData({
              noMoreShow: false,
              loading: true,
            })
          }
        }
        // let resData = data.bussData;
        // console.log(resData);
        // this.setData({
        //   subleaseInfo: resData
        // })
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
  //分页功能
  searchScrollLower() {
    let { pageIndex, pageCount } = this.data;
    if (!this.data.loading) return false;
    this.setData({
      loading: true
    })
    if (pageCount <= pageIndex) return false;
    this.data.pageIndex++;
    if (this.data.pageIndex == 11) return false;
    this.getList();
    if (pageCount - 1 <= pageIndex) {
      this.setData({
        noMoreShow: false
      })
    }
  },
})