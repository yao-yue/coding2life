// pages/search/index.js
Page({
  data: {
    keyWord:'',
    toPage:'',
    list:[]
  },
  onLoad: function (options) {
    let toPage = options.fromPage;
    let list = [];
    if(toPage == 'searchList'){
      list = wx.getStorageSync('indexKeywordList') ? wx.getStorageSync('indexKeywordList') : [];
    }
    else{
      list = wx.getStorageSync('keywordList') ? wx.getStorageSync('keywordList') : [];
    }
    this.setData({
      list,
      toPage: options.fromPage,
      keyWord: options.keyWord ? options.keyWord:''
   })
  },
  keyBind(e){
    this.setData({
      keyWord:e.detail.value
    })
  },
  empty(){
    this.setData({
      keyWord:''
    })
  },
  search(){
    let list = this.data.list;
    let url = `../${this.data.toPage}/index`;
    if (this.data.keyWord){
      url = `../${this.data.toPage}/index?keyWord=${this.data.keyWord}`;
      list.push(this.data.keyWord);
      if (this.data.toPage == 'searchList') { wx.setStorageSync('indexKeywordList', list); }
      else { wx.setStorageSync('keywordList', list); }
    }
    wx.redirectTo({
      url: url
    });
  },
  searchByHistory(e){
    let keyWord = e.currentTarget.dataset.key;
    let url = `../${this.data.toPage}/index?keyWord=${keyWord}`;
    wx.redirectTo({
      url: url
    })
  },
  deleteHistory(){
    if (this.data.toPage == 'searchList') { wx.removeStorageSync('indexKeywordList'); }
    else { wx.removeStorageSync('keywordList');  }
    this.setData({
      list:[]
    })
  }
})