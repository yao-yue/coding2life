const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    dataList: [],
    scrollShow: false,
    pageCount: 0,
    id: '',
    productType:'',
    noMoreShow:false,
    tagList: ['车内干净', '驾驶很安全', '很耐心']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.productType = options.productType;
    this.data.id = options.id;
  },
  onShow: function (options) {
    if (this.data.pageCount == this.data.pageIndex) return
    this.getList()
  },
  getList() {
    let url = API.URL.ORDER.FINDREPLYPAGE;
    util.http({
      url: url,
      dataForm: {
        pageIndex: this.data.pageIndex,
        pageSize: 10,
        productId: this.data.id,
        productType: this.data.productType
      },
      success: ({ data }) => {
        this.setData({
          dataList: this.data.dataList.concat(data.bussData),
          pageCount: data.pageCount
        })
      },
      revertBack: () => {
        // this.getList();
        wx.navigateTo({
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
  },  //预览图片
  previewImage: function (e) {
    let current = e.currentTarget.dataset.index,
      imagesList = e.currentTarget.dataset.imagelist,
      that = this,
      imageArr = [];

    imagesList.map((item) => {
      imageArr.push(item.fileUrl)
    })

    wx.previewImage({
      current: imageArr[current],
      urls: imageArr
    })
  },
})