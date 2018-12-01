const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function http({ url, data, dataForm = {}, method = 'POST', success, fail, revertBack } = {}) {
  const openId = wx.getStorageSync('openId');
  const sessionId = wx.getStorageSync('sessionId');
  let str = '';
  for (var item in dataForm) {
    str = str + '&' + item + '=' + dataForm[item]
  }
  var api = sessionId ? url + '?openId=' + openId + '&sessionId=' + sessionId : url + '?openId=' + openId;
  var url = str ? api + str : api;
  wx.request({
    url: url,
    data: {
      body: data ? JSON.stringify(data) : ''
    },
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    method,
    success: function (res) {
      // console.log(res)
      if (res.data.status == '200') {
        success && success(res.data);
      }
      else if (res.data.status == '401') {
        // let appInstance = getApp();
        // appInstance.login(revertBack);
        if (revertBack){
          revertBack(); 
        }
        else{
          wx.navigateTo({
            url: '../login/index'
          })
        }
      }
      else {
        fail && fail(res.data);
      }
    },
    fail: function (res) {
      // 请求失败，错误处理 
      //  errorHander(res);
    }
  })
}

function initChart(canvas, width, height,option) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}


module.exports = {
  formatTime: formatTime,
  formatNumber:formatNumber,
  http:http,
}
