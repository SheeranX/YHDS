let promise = require("promise.js");
let utils = require("../../utils/util.js");
let server = require("../../utils/interface.js");


let newPormise = promise.wxPromise(wx.request);

// console.log(common)
let app = getApp();
let userInfo = {};
let isAllowReq = true;
let request = function(obj) {
  let req = null
  //请求参数封装
  let params = () => {
    return {
      header: obj.header || {
        'content-Type': ' text/plain'
      },
      method: obj.method || "post",
      url: server.BASE + obj.url,
      data: JSON.stringify(Object.assign(obj.data || {}, common))
    }
  }
  let session_id = wx.getStorageSync("session_id")
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  let common = {
    "timestamp": utils.getTimestamp("current"),
    "sessionid": session_id
  }
  let getSetting = promise.wxPromise(wx.getSetting, true);
  return getSetting().then(res=>{
    if (res.authSetting['scope.userInfo']) 
    {
        return promise.wxPromise(wx.getUserInfo,true)()
      }
    else
    {   //获取当前页面路径，计算目标url的绝对路径
        const length = getCurrentPages().length;
        const currentRoute = getCurrentPages()[length - 1].route;
        const pathIndex = currentRoute.split('/').length;
        let url = ""
        for (let i = 0; i < pathIndex - 1; i++) {
          url += '../'
        }
        wx.navigateTo({
          url: url+'pages/getAuth/getAuth',
        })

        return Promise.reject({
          isNotException:false
        });
    }
  }).then(res=>{
  //  app.globalData.userInfo = res.userInfo;
    userInfo = res.userInfo;
    console.log(res);
    return newPormise({ //判断用户是否登陆
      url: server.BASE + server.loginStatus.checkLoginStatus,
      data: JSON.stringify(common),
      method: 'post'
    }) 
  }).then(res => {
    if (res.code === "60007") //登陆超时则重新登陆
    {
      return promise.wxPromise(wx.login, true)()
    }
    else {
      //用户已登陆
      console.log("已登录");
      return Promise.reject({
        isNotException: true,
        value: params()
      }) //newPormise(params)
    }
  }).then(res => {
    console.log("重新登陆");
    let code = res.code;
    console.log(res);
    return newPormise({
      url: server.BASE + server.loginStatus.toLogin,
      data: JSON.stringify(Object.assign({
        timestamp: utils.getTimestamp("current"),
        code: code,
      }, userInfo)),
      header: {
        'content-Type': 'text/plain',
      },
      method: "POST",
    })
  }).then(res => {
    //登陆成功，更新session
    console.log(res);
    common.sessionid = res.sessionid;
    common.timestamp = utils.getTimestamp("current");
    wx.setStorageSync('session_id', res.sessionid);
    console.log(common);
    return Promise.reject({
      isNotException: true,
      value: params()
    })
  }).catch(error => {
    if (error.isNotException) {
      return newPormise(params())
    }
    else {
      console.log(error);
      return Promise.reject()
    }
  });
  
}

module.exports = {
  http: request
}
