// pages/mySubleaseList/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    // pageIndex: 1,
    // list: [],
    pageIndex: 1,
    pageCount: '',
    noMoreShow: true,
    loading: true,
    scrollHeight: '',
    list: [],
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
       // this.getList();
        this.setData({
          scrollHeight: parseInt(res.windowHeight)
        })
      }
    });
  },
  onShow(){
    this.setData({
      pageIndex: 1,
      pageCount: '',
      noMoreShow: true,
      loading: true,
      scrollHeight: '',
      list: [],
    });
    this.getList();
  },
  getList() {
    let url = API.URL.USERRENT.FINDUSERRENTPRODUCTBYPAGE;
    util.http({
      url: url,
      dataForm: {
        pageIndex: this.data.pageIndex,
        pageSize: 10
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

          let dataList = this.data.list;
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].buyTime = dataList[i].buyTime.slice(0, 11);
            // dataList[i].rangeDate = dataList[i].rangeDate.slice(5, 10);
            dataList[i].price = parseFloat(dataList[i].price).toFixed(2);
          }
          console.log(dataList);
          this.setData({
            list: dataList
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
  toSublease (e) {
    wx.navigateTo({
      url: `/pages/subleaseSettings/index?id=${e.currentTarget.dataset.id}`,
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