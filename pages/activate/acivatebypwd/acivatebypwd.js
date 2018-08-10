let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
var validate = require('../../../utils/validate.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {
      title: "",
      cardName: "",
      giveFlag: 'N'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = options.data;
    if (data) {
      let cardno = data.split(',')[0];
      let pwd = data.split(',')[1];
      this.setData({
        cardno: cardno,
        pwd: pwd,
        giveFlag: 'Y'
      })
    }
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
  bindSubmit: function(e) {
    var cardNo = e.detail.value.cardNo;
    var cardPW = e.detail.value.cardPW;
    let _this = this;
    if (cardNo == null || cardNo == "" || cardPW == null || cardPW == "") {
      wx.showToast({
        title: '请输入卡号和密码',
        icon: 'none',
        duration: 2000
      })
    } else {
      let params = {
        url: personnel.personnel.queryCardByNoAndPwd,
        data: e.detail.value
      }
      //一个封装的请求方法
      request.http(params).then(res => {
        console.log(res)
        wx.hideLoading();
        var code = res.code;
        if (code == 0) {
          if (res.ticketOrderCardDetailList.length == res.peopleNums) {
            wx.showToast({
              title: '可激活人数已达到上限',
              icon: 'none'
            })
            return
          }
          app.globalData.userBindFlag = res.userBindFlag
          if (res.peopleNums > 1) {
            wx.redirectTo({
              url: '../activates/activates?data=' + JSON.stringify(res),
            })
          } else {
            wx.redirectTo({
              url: '../activate?cardNo=' + cardNo + '&ticketTypeName=' + res.ticketName + "&cardAccountValue=" + res.cardAccountValue + "&peopleNums=" + res.peopleNums + "&ticketOrderCardDetailList=" + JSON.stringify(res.ticketOrderCardDetailList) + '&giveFlag=' + _this.data.giveFlag
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