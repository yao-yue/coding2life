const JL = require('../../utils/throttle')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 450,
    scale: 1,
    topTip: '感谢您的测试,您当前处于',
    footerTip: '对于此次测试结果的文字描述',
    hasAuth: false,
    needOpen: false,
  },
  afterSize(length) {
    let scale = this.data.scale;
    return length * scale;
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth;
        this.setData({
          width,
          scale: width / 375
        })

      }
    });

    // 初始化canvas
    const canvasId = "resCanvas";
    // canvas绘图 内部的世界context绘图上下文环境
    const ctx = wx.createCanvasContext(canvasId);
    // canvas 的绘制大小 下雨， 没什么界面，
    // 750 设计稿优先 画布 
    let { width, scale } = this.data;
    console.log(width, scale);
    let height = 450 * scale;
    let descText = "今年过节不收里手里只收老白金"
    this.writeText(ctx, this.data.topTip, 12, width / 2, 18, '#333333');
    this.writeText(ctx, '感情流浪汉阶段', 15, width / 2, 46, '#F2A678');
    this.writeText(ctx, this.data.footerTip, 12, width / 2, 83, '#333333');
    // for(let i = 0; i< [descText].length; i++ ) {
    //   descTextList.push([descText].slice)
    // }
    this.writeText(ctx, descText, 12, width / 2, 108, '#333333');
    ctx.draw();
  },
  drawCallback() {
    let that = this;
    let { width, height, scale } = this.data;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width,
      height: height * scale,
      destWidth: width * 2,
      destHeight: height * 2,
      canvasId: 'resCanvas',
      success(res) {
        console.log(res.tempFilePath)
        let tempFilePath = res.tempFilePath;
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  console.log('授权成功')
                  that.saveToAlbum(tempFilePath);
                },
                fail(err) {
                  console.log('未授权')
                  that.setData({
                    needOpen: true,
                  })
                },
                complete() {
                  that.setData({
                    hasAuth: true
                  })
                }
              })
            } else {
              console.log('已授权入口进入');
              that.saveToAlbum(tempFilePath);
              
            }
          },
        })
      },
      fail(err) {
        wx.showToast({
          title: '未知错误',
          icon: 'none',
          duration: 1000
        })
      }

    })
  },
  writeText(ctx, str, fontSize, startX, startY, color) {
    ctx.save()
    startX = this.afterSize(startX);
    startY = this.afterSize(startY);
    ctx.setFontSize(fontSize);
    ctx.setTextBaseline('top')
    ctx.setFillStyle(color);
    ctx.setTextAlign('center')
    ctx.fillText(str, startX, startY);
    ctx.restore();
  },
  saveImg: JL.throttle(function () {
    const ctx = wx.createCanvasContext('resCanvas');
    let drawCallback = this.drawCallback();
    let that = this;
    
    console.log(that.data.hasAuth,that.data.needOpen)
    if(that.data.hasAuth && that.data.needOpen) {
      wx.openSetting({
        success: (res) => {
          console.log('从openSeting入口进入')
          if(res.authSetting['scope.writePhotosAlbum']) {
            console.log('怎么没效果')
            ctx.draw(true, drawCallback);
            that.setData({
              needOpen: false
            })
          }
          else {
            wx.showToast({
              title: '您放弃了授权',
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail() {
          wx.showToast({
            title: '您放弃了授权',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else {
      ctx.draw(true, drawCallback);
    }
  }, 1500),
  saveToAlbum(path) {
    
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `我竟然是-感情流浪汉阶段`,
      path: '/page/user?id=123'
    }
  }
})