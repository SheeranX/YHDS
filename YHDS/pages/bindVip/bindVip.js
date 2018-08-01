// pages/bindVip/bindVip.js
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");
var validate = require('../../utils/validate.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  /**
   * 表单提交事件
   */
  bindSubmit: function(e) {
    var cardNo = e.detail.value.cardNo;
    var cardPW = e.detail.value.cardPW;
    if (cardNo == null || cardNo == "" || cardPW == null || cardPW == "") {
      wx.showToast({
        title: '请输入卡号和密码',
        icon: 'none',
        duration: 2000
      })
    }
    if (cardNo == null || cardNo == "" || cardPW == null || cardPW == "") {
      wx.showToast({
        title: '请输入卡号和密码',
        icon: 'none',
        duration: 2000
      })
    } else {
      let params = {
        url: personnel.personnel.getAddVipPhotoInfo,
        data: e.detail.value
      }
      //一个封装的请求方法
      request.http(params).then(res => {
        var code = res.code;
        wx.hideLoading();
        if (code == 0) {
          if (res.ticketOrderCardDetailList.length > 0) {
            var photoPath = null;
            for (var i = 0; i < res.ticketOrderCardDetailList.length; i++) {
              if (res.ticketOrderCardDetailList[i].photoPath != null) {
                photoPath = false;
              } else {
                photoPath = true;
              }
            }
            if (photoPath) {
              wx.redirectTo({
                url: '../addVipPhoto/addVipPhoto?data=' + JSON.stringify(res)
              })
            } else {
              wx.showToast({
                title: '用户已录入照片',
                icon: 'none',
                duration: 2000,
              })
            }
          } else {           
            wx.showToast({
              title: '该用户未激活',
              icon: 'none',
              duration: 2000,

            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  }
})