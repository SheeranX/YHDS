// pages/registerCard/registerCard.js
var utils = require('../../utils/util.js')
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {
      title: "",
      cardName: "",
      price: 0,
      ticketId: 0
    },
    cardInfos: [],
    peopleFlag: true,
    buttonText: "下一步"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.peopleNums = null;
    app.globalData.customers = null;
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
    var that = this;
    let params = {
      url: personnel.personnel.queryCard,
    }
    request.http(params).then(
      res => {
        var code = res.code;
        if (code == 0) {
          that.setData({
            cardInfos: res.ticketCardList
          })
          console.log(res.ticketCardList)
          var item = res.ticketCardList[0];
          console.log(item)
          var cardInfo = {
            title: item.ticketName,
            cardName: "月湖雕塑公园",
            price: item.price,
            peopleNums: item.peopleNums,
            ticketId: item.ticketId
          };
          that.setData({
            cardInfo: cardInfo
          })
        } else {
          wx.showToast({
            title: '请检查网络',
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    );
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
   * 选卡事件
   */
  radioGroupChange: function(e) {
    var cardInfos = this.data.cardInfos;
    var item = cardInfos[e.detail.value];
    var cardInfo = {
      title: item.ticketName,
      cardName: "月湖雕塑公园",
      price: item.price,
      peopleNums: item.peopleNums,
      ticketId: item.ticketId
    };
    this.setData({
      cardInfo: cardInfo
    })
  },
  /**
   * 隐藏录入信息
   */
  hideThis: function() {
    this.setData({
      peopleFlag: false,
      buttonText: "立即支付"
    })
  },
  /**
   * 显示录入信息
   */
  showThis: function() {
    this.setData({
      peopleFlag: true,
      buttonText: "下一步"
    })
  },
  /**
   * 下一步按钮点击事件
   */
  InputInfo: function() {
    var peopleFlag = this.data.peopleFlag;
    var cardInfo = this.data.cardInfo;
    if (peopleFlag) {
      if (cardInfo.peopleNums == 1) {
        wx.redirectTo({
          url: 'customerDetail/customerDetail?title=' + cardInfo.title + '&cardName=' + cardInfo.cardName + '&price=' + cardInfo.price + '&ticketId=' + cardInfo.ticketId,
        })
      } else {
        wx.redirectTo({
          url: 'addCustomer/addCustomer?title=' + cardInfo.title + '&cardName=' + cardInfo.cardName + '&price=' + cardInfo.price + '&ticketId=' + cardInfo.ticketId + '&peopleNums=' + cardInfo.peopleNums,
        })
      }
    } else {
      //  var saveOrder = app.globalData.saveOrder;
      var that = this;
      let params = {
        url: personnel.personnel.saveOrder,
        data: {
          ticketTypeId: cardInfo.ticketId,
          entryPersonFlag: "N",
          recommenCustomerHeadId: "",
          ticketOrderCardDetailList: []
        }
      };
      request.http(params).then(
        res => {
          var code = res.code;
          if (code == 0) {
            let params2 = {
              url: personnel.personnel.pay,
              data: {
                cardOrderNo: res.cardOrderNo
              }
            };
            request.http(params2).then(
              res => {
                var code = res.code;
                if (code == 0) {
                  var nonceStr = res.nonceStr;
                  var prepayId = res.prepayId;
                  var signType = res.signType;
                  var timeStamp = res.timeStamp;
                  var paySign = res.paySign;
                  wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': nonceStr,
                    'package': prepayId,
                    'signType': signType,
                    'paySign': paySign,
                    'success': function(res) {
                      console.log("成功")
                      wx.showModal({
                        title: '提示',
                        content: '办理成功',
                        cancelText: '回主页',
                        confirmText: '去查看',
                        success: function(res) {
                          if (res.confirm) {
                            wx.redirectTo({
                              url: '../personnel/purchasedCard/purchasedCard',
                            })
                          } else if (res.cancel) {
                            wx.switchTab({
                              url: '../index/index',
                            })
                          }
                        }
                      })
                    },
                    'fail': function(res) {
                      console.log(res)
                      console.log("失败")
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                  })
                }
                wx.hideLoading();
              }
            );
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      );
    }
  }
})