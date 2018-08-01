let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
var validate = require('../../../utils/validate.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateNo: ''
  },

  //查询卡信息
  formSubmit: function(e) {
    var submitData = e.detail.value;
    var certificateNo = submitData.certificateNo;
    var flag = validate.isIdCard(certificateNo);
    if (!flag) {
      wx.showToast({
        title: '身份证号码不合法!',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let params = {
      url: personnel.personnel.queryCardForBind,
      data:e.detail.value
    }
    //一个封装的请求方法
    request.http(params).then(res => {
      var code = res.code;
      wx.hideLoading();
      if (code == 0) {
        wx.navigateTo({
          url: '../bindCard?data=' + JSON.stringify(res)
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