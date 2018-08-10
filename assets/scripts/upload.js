let utils = require("../../utils/util.js");
let server = require("../../utils/interface.js");
let promise = require("promise.js");
let request = promise.wxPromise(wx.request);
//let chooseImg = promise.wxPromise(wx.chooseImage);
let upload = promise.wxPromise(wx.uploadFile);


let wxPromise = function(fn) {
  return function(obj = {}) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    return new Promise((resolve, reject) => {
      obj.success = function(res) {

        wx.hideLoading()
        resolve(res);
      }

      obj.fail = function(res) {
        wx.hideLoading()
        reject(res);
      }

      fn(obj);
    });
  }
}


let chooseImg = wxPromise(wx.chooseImage);

let uploadImg = function(e) {
  let session_id = wx.getStorageSync("session_id")
  let common = {
    "timestamp": utils.getTimestamp("current"),
    "sessionid": session_id
  }

  return request({ //判断用户是否登陆
    url: server.BASE + server.loginStatus.checkLoginStatus,
    data: JSON.stringify(common),
    method: 'post'
  }).then(res => {
    if (res === "60007") //登陆超时则重新登陆
    {
      return promise.wxPromise(wx.login)
    } else {
      //用户已登陆
      console.log("已登录");
      return Promise.reject({
        isNotException: true,
      }) //newPormise(params)
    }
  }).then(res => {
    let code = res.code;
    return newPormise({
      url: server.BASE + server.loginStatus.toLogin,
      data: JSON.stringify({
        timestamp: timestamp,
        code: code
      }),
      header: {
        'content-Type': 'text/plain',
      },
      method: "POST",
    })
  }).then(res => {
    //登陆成功，更新session
    wx.setStorageSync('session_id', res.data.sessionid)
    common.sessionid = res.data.sessionid;
    return Promise.reject({
      isNotException: true
    })
  }).catch(error => {
    if (error.isNotException) {
      let para = {
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      }
      return chooseImg(para)
    } else {
      console.log(error);
    }
  })
}

// let uploadImg = function(e){
//   wx.chooseImage({
//     count: 1, // 默认9
//     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//     success: function(res) {

//     },
//   })
// }

module.exports = {
  uploadImg: uploadImg
}
