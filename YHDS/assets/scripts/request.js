let promise = require("promise.js");
let utils = require("../../utils/util.js");
let server = require("../../utils/interface.js");


let newPormise = promise.wxPromise(wx.request);

// console.log(common)

let request = function(obj) {
  let session_id = wx.getStorageSync("session_id")
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  let common = {
    "timestamp": utils.getTimestamp("current"),
    "sessionid": session_id
  }
  //请求参数封装
  let params = ()=>{
    return {
      header: obj.header || { 
        'content-Type': ' text/plain'
      },
      method: obj.method || "post",
      url: server.BASE + obj.url,
      data: JSON.stringify(Object.assign(obj.data || {}, common))
    }
  }
  return newPormise({ //判断用户是否登陆
    url: server.BASE + server.loginStatus.checkLoginStatus,
    data: JSON.stringify(common),
    method: 'post'
  }).then(res => {
    if (res.code=== "60007") //登陆超时则重新登陆
    {
      return promise.wxPromise(wx.login,true)()
    }
    else 
     {
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
      data: JSON.stringify({
        timestamp: utils.getTimestamp("current"),
        code: code
      }),
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
    if (error.isNotException) 
    {
      return newPormise(params())
    } 
    else
     {
      console.log(error);
    }
  });
}

module.exports = {
  http: request
}
