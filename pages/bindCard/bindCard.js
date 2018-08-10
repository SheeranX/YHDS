var validate = require('../../utils/validate.js')
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");
let inter = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {
      ticketTypeName: "",
      cardKind: "",
      cardNo: "",
      cardAccountValue: "0",
      certificateNo: "",
      phoneNo: "",
      disabled:false,
    },
    getMsg: "发送验证码"

  },

  //发送短信
  sendSms: function(e) {
    let self = this;
    let time = 60;
    var phoneNo = this.data.cardInfo.phoneNo;
    var flag = validate.isPhoneNo(phoneNo);
    if (!flag) {
      wx.showToast({
        title: '手机号码不合法',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    let params = {
      url: personnel.personnel.sendSms,
      data: {
        phoneNo: phoneNo,
      }
    }
    //一个封装的请求方法
    request.http(params).then(res => {
      var code = res.code;
      wx.hideLoading();
      if (code == 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
          success: function () {
            inter = setInterval(function () {
              self.setData({
                getMsg: time + 's后重发',
                disabled: true
              })
              time--;
              if (time < 0) {
                clearInterval(inter)
                self.setData({
                  getMsg: '发送动态码',
                  disabled: false
                });
              }
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //会员卡绑定
  formSubmit: function(e) {
    var submitData = e.detail.value;
    var phoneNo = submitData.phoneNo;
    var flag = validate.isPhoneNo(phoneNo);
    if (!flag) {
      wx.showToast({
        title: '手机号码不合法',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var verificationCode = submitData.verificationCode;
    if (verificationCode == '') {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var certificateNo = this.data.cardInfo.certificateNo;
    submitData.certificateNo = certificateNo;
    let params = {
      url: personnel.personnel.bindCard,
      data: submitData
    }
    //一个封装的请求方法
    request.http(params).then(res => {
      wx.hideLoading();
      var code = res.code;
      if (code == 0) {
        wx.showModal({
          title: '提示',
          content: '绑定成功成功',
          cancelText: '回主页',
          confirmText: '去查看',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../personnel/personnel',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }    
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cardData = JSON.parse(options.data)
    this.setData({
      cardInfo: cardData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})