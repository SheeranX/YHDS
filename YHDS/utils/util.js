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
/**
 * 时间格式转换
 * YYYYMMDDSS
 */
function formatDateToString(date) {
  if (checkIsNull(date)) {
    date = new Date();
  }
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return year + month + day;
}

function formateDateAndTimeToString(date) {
  var hours = date.getHours();
  var mins = date.getMinutes();
  var secs = date.getSeconds();
  var msecs = date.getMilliseconds();
  if (hours < 10) hours = "0" + hours;
  if (mins < 10) mins = "0" + mins;
  if (secs < 10) secs = "0" + secs;
  if (msecs < 10) secs = "0" + msecs;
  return formatDateToString(date) + hours + mins + secs + msecs;
}

var getTimestamp = function(data) {
  //获取时间戳
  var date = new Date(Date.parse(new Date()));
  var year = date.getFullYear();
  var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  var hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
  var minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  var second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  // var timestamp = "" +  + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
  return "" + year + month + day + hour + minute + second
}

var reLogin = function(utils) {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log(res.code);
      //为防止请求时间过长显示进度条
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      const app = getApp();
      var code = res.code;
      var that = this;
      var serverUrl = app.globalData.serverUrl;
      var getOpenIdUrl = serverUrl + '/wxnkInterface/toLogin.do';
      console.log(getOpenIdUrl)
      var timestamp = utils.getTimestamp("data");
      wx.request({
        url: getOpenIdUrl,
        method: "POST",
        data: JSON.stringify({
          timestamp: timestamp,
          code: code
        }),
        header: {
          'content-Type': 'text/plain',
        },
        success: function(res) {
          var code = res.data.code;
          if (code == 0) {
            that.globalData.session_id = res.data.sessionid
            wx.hideLoading()
          } else if (code == 60007) {
            utils.reLogin(utils);
          } else {
            wx.showToast({
              title: '' + res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '请检查网络',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  getTimestamp: getTimestamp,
  reLogin: reLogin
}

module.exports.formateDateAndTimeToString = formateDateAndTimeToString;