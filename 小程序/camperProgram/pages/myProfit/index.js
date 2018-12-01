// pages/myProfit/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    list:[
      { name: '房客积分', icon: '../../images/customer.png', value: '0.00', active: true, 
        record: [], pageIndex: 1, pageCount: 0, pointType: 'customer', noMoreShow:false },
      { name: '服务积分', icon: '../../images/service.png', value: '0.00', active: true, 
        record: [], pageIndex: 1, pageCount: 0, pointType: 'service', noMoreShow: false},
      { name: '红润积分', icon: '../../images/profit.png', value: '0.00', active: true, 
        record: [], pageIndex: 1, pageCount: 0, pointType: 'profit', noMoreShow: false},
      { name: '租赁积分', icon: '../../images/rent.png', value: '0.00', active: true, 
        record: [], pageIndex: 1, pageCount: 0, pointType: 'rent', noMoreShow: false},
      { name: '代理积分', icon: '../../images/agent.png', value: '0.00', active: true, 
        record: [], pageIndex: 1, pageCount: 0, pointType: 'agent', noMoreShow: false}
    ],
    totalPoints:'0.00',
    yesterdayPoints:'0.00',
  },
  onLoad: function (options) {
    this.getInfo();
  },
  collapseTab(e){
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    let isActive = list[index].active;
    list[index].active = !isActive;
    list[index].pageIndex = 1;
    list[index].pageCount = 0;
    list[index].record = [];
    this.setData({list});
    let pointType = list[index].pointType;
    // let pageIndex = list[index].pageIndex;
    this.getList(index, pointType,1);
  },
  getInfo() {
    let list = this.data.list;
    let url = API.URL.POINT.FINDPOINTGROUP;
    util.http({
      url: url,
      success: ({ data:{ bussData } }) => {
        let yesterdayDetails = bussData.yesterdayDetails;
        yesterdayDetails.forEach((item)=>{
          if (item.pointType == 'customer'){
            list[0].value = item.totalPoints;
          }
          if (item.pointType == 'service') {
            list[1].value = item.totalPoints;
          }
          if (item.pointType == 'profit') {
            list[2].value = item.totalPoints;
          }
          if (item.pointType == 'rent') {
            list[3].value = item.totalPoints;
          }
          if (item.pointType == 'agent') {
            list[4].value = item.totalPoints;
          }
        });
        this.setData({
          yesterdayPoints: bussData.yesterdayPoints ? bussData.yesterdayPoints : '0.00',
          totalPoints: bussData.totalPoints ? bussData.totalPoints:'0.00',
          list
        })
      },
      revertBack: () => {
        wx.reLaunch({
          url: '../login/index'
        })
      }
    })
  },
  getList(index, pointType, pageIndex) {
    let url = API.URL.POINT.FINDBALACNEPAGE
    util.http({
      url: url,
      dataForm: {
        pageIndex: pageIndex,
        pageSize: 10,
        pointType: pointType
      },
      success: ({ data }) => {
        console.log(data);
        let list = this.data.list;
        list[index].pageCount = data.pageCount;
        list[index].pageIndex = pageIndex;
        if(data.bussData){
          list[index].record = list[index].record.concat(data.bussData);
        }
        console.log(list);
        this.setData({
          list:list
        });
        console.log(list);
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
  loadMore(e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let pointType = e.currentTarget.dataset.type;
    let pageIndex = e.currentTarget.dataset.page;
    let pageCount = this.data.list[index].pageCount;
    if (pageCount <= pageIndex) {
      list[index].noMoreShow = true;
      this.setData({
        list:list
      });
      return false;
    }
    pageIndex++;
    this.getList(index,pointType,pageIndex);
  },
})