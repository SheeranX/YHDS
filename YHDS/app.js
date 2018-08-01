//app.js
var utils = require('utils/util.js')
let server = require('utils/interface.js');

App({
  onLaunch: function() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //为防止请求时间过长显示进度条
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        var code = res.code;
        var that = this;
        var timestamp = utils.getTimestamp("date");
        wx.request({
          url: server.BASE + server.loginStatus.toLogin,
          method: "POST",
          data: JSON.stringify({
            timestamp: timestamp,
            code: code
          }),
          header: {
            'content-Type': 'text/plain',
          },
          success: function(res) {
            wx.setStorageSync('session_id', res.data.sessionid)
            // 获取用户信息
            wx.getSetting({
              success: res => {
                console.log(res);
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      console.log(res);
                      that.globalData.userInfo = res.userInfo
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                    },
                    fail: function (res) {
                      console.log(res);
                    }
                  })
                }
              },
              fail: function (res) {
                console.log(res);
              }
            })
            wx.hideLoading()
          },
          fail: function() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    session_id: '',
    customers: null,
    index: 0,
    cardInfo: null,
    peopleNums: null,
    isPeopleNums: null
  }
})
