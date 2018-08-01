// pages/registerCard/chooseCard/chooseCard.js
var utils = require('../../../utils/util.js')
let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let app = getApp();
let addCustomer = {
  /**
   * 页面的初始数据
   */
  data: {
    customer: {
      name: "Sheeran",
      status: "未绑定",
      idcard: "330621544123365478",
      mobile: "1512132512",
      path: ''
    },
    cardInfo: {
      title: "夜壶屌公园老年卡",
      cardName: "上海月湖雕塑公园"
    },
    customers: null,
    card: null,
    peopleNums: null,
    flag: true,
    vipid: ""
  },
  /**
   *页面方法
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync("vipid")) {
      this.setData({
        vipid: wx.getStorageSync("vipid")
      })
    }
    var userName = options.userName;
    var cardType = options.cardType;
    var cardTypeId = options.cardTypeId;
    var cardNo = options.cardNo;
    var phoneNum = options.phoneNum;
    var photoPath = options.photoPath;
    var path = options.path;
    var peopleNums = app.globalData.peopleNums;
    if (peopleNums == null) {
      app.globalData.peopleNums = options.peopleNums
    }
    var isPeopleNums = app.globalData.isPeopleNums;
    if (isPeopleNums == null) {
      app.globalData.isPeopleNums = options.peopleNums
    }
    this.setData({
      peopleNums: app.globalData.peopleNums
    })
    if (userName != null && cardType != null && cardTypeId != null && cardNo != null && phoneNum != null && photoPath != null && path != null) {
      var customers = app.globalData.customers;
      if (customers == null) {
        customers = new Array();
      }
      if (customers.length >= peopleNums) {
        this.setData({
          flag: false
        })
      } else {
        this.setData({
          flag: true
        })
      }
      var customer = {
        name: userName,
        status: "未绑定",
        idcard: cardNo,
        mobile: phoneNum,
        path: path,
        index: customers.length,
        cardTypeId: cardTypeId,
        photoPath: photoPath,
        delPath: '../../assets/images/delete.png'
      };
      var length = customers.length
      customers[length] = customer;
      this.setData({
        customers: customers
      })
      app.globalData.customers = customers
    }
    var cardInfo = {
      title: options.title,
      cardName: options.cardName,
      price: options.price,
      ticketId: options.ticketId
    }
    if (app.globalData.cardInfo == null) {
      app.globalData.cardInfo = cardInfo;
    }
    this.setData({
      cardInfo: app.globalData.cardInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.customercard = this.selectComponent("#customercard")
    console.log("组件" + this.customercard)
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
  _deleteEvent: function() {
    debugger;
    var peopleNums = app.globalData.peopleNums;
    app.globalData.peopleNums = peopleNums + 1;
    this.setData({
      peopleNums: app.globalData.peopleNums
    })
    var index = app.globalData.index;
    var customers = app.globalData.customers;
    if (customers.length > 0) {
      customers.splice(index, 1)
    }
    if (customers.length <= this.data.peopleNums) {
      this.setData({
        flag: true
      })
    }
    this.setData({
      customers: customers
    })
  },
  /**
   * form的提交方法
   */
  bindSubmit: function(e) {
    const app = getApp();
    var customers = app.globalData.customers;
    var ticketOrderCardDetailList = [];
    var saveOrder = app.globalData.saveOrder;
    var that = this;
    var ticketId = this.data.cardInfo.ticketId;
    if (customers != null) {
      for (var i = 0; i < customers.length; i++) {
        var ticketOrder = {
          certificateName: customers[i].name,
          certificateTypeId: customers[i].cardTypeId,
          certificateNo: customers[i].idcard,
          phone: customers[i].mobile,
          photoPath: customers[i].photoPath,
          bindWeiXinFlag: "N"
        };
        ticketOrderCardDetailList[ticketOrderCardDetailList.length] = ticketOrder
      }
      var vipId = e.detail.value.vipId; //推荐人ID
      //有推荐人
      if (vipId != '') {
        let checkVipIdParams = {
          url: personnel.personnel.checkVip,
          data: {
            customerCodeId: vipId
          }
        };
        request.http(checkVipIdParams).then(
          res => {
            var code = res.code;
            if (code == 0) {
              let saveOrderParams = {
                url: personnel.personnel.saveOrder,
                data: {
                  ticketTypeId: ticketId,
                  entryPersonFlag: "Y",
                  recommenCustomerHeadId: vipId,
                  ticketOrderCardDetailList: ticketOrderCardDetailList
                }
              };
              request.http(saveOrderParams).then(
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
                          wx.hideLoading();
                          wx.requestPayment({
                            'timeStamp': timeStamp,
                            'nonceStr': nonceStr,
                            'package': prepayId,
                            'signType': signType,
                            'paySign': paySign,
                            'success': function(res) {
                              app.globalData.peopleNums = null;
                              wx.showModal({
                                title: '提示',
                                content: '办理成功',
                                cancelText: '回主页',
                                confirmText: '去查看',
                                success: function(res) {
                                  if (res.confirm) {
                                    wx.redirectTo({
                                      url: '../../personnel/purchasedCard/purchasedCard',
                                    })
                                  } else if (res.cancel) {
                                    wx.switchTab({
                                      url: '../../index/index',
                                    })
                                  }
                                }
                              })
                            },
                            'fail': function(res) {}
                          })
                        } else {
                          wx.showToast({
                            title: res.message,
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      }
                    );
                  } else {
                    wx.showToast({
                      title: '' + res.message,
                      icon: 'none',
                      duration: 2000,
                    })
                  }
                }
              );
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000,
              })
            }
          }
        );
        //没推荐人
      } else {
        let saveOrderParams = {
          url: personnel.personnel.saveOrder,
          data: {
            ticketTypeId: ticketId,
            entryPersonFlag: "Y",
            recommenCustomerHeadId: "",
            ticketOrderCardDetailList: ticketOrderCardDetailList
          }
        };
        request.http(saveOrderParams).then(
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
                    wx.hideLoading();
                    wx.requestPayment({
                      'timeStamp': timeStamp,
                      'nonceStr': nonceStr,
                      'package': prepayId,
                      'signType': signType,
                      'paySign': paySign,
                      'success': function(res) {
                        wx.showModal({
                          title: '提示',
                          content: '办理成功',
                          cancelText: '回主页',
                          confirmText: '去查看',
                          success: function(res) {
                            if (res.confirm) {
                              wx.redirectTo({
                                url: '../../personnel/purchasedCard/purchasedCard',
                              })
                            } else if (res.cancel) {
                              wx.switchTab({
                                url: '../../index/index',
                              })
                            }
                          }
                        })
                      },
                      'fail': function(res) {}
                    })
                  } else {
                    wx.showToast({
                      title: res.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              );
            } else {
              wx.showToast({
                title: '' + res.message,
                icon: 'none',
                duration: 2000,
              })
            }
          }
        );
      }
    } else {
      wx: wx.showToast({
        title: '请添加家庭成员',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  /**
   * 添加家庭成员
   */
  navigatorAddPeople: function() {
    const app = getApp();
    var customers = app.globalData.customers;
    var isPeopleNums = app.globalData.isPeopleNums;
    if (customers != null) {
      if (customers.length < isPeopleNums) {
        wx.redirectTo({
          url: '../addOnePeople/addOnePeople?pageType=1',
        })
      } else {
        wx.showToast({
          title: '本卡最多只能有' + isPeopleNums + '人',
          icon: 'none',
          duration: 2000,
        })
      }
    } else {
      wx.redirectTo({
        url: '../addOnePeople/addOnePeople?pageType=1',
      })
    }
  }
}

Page(addCustomer)