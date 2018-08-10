// pages/activate/activates/activates.js
var validate = require('../../../utils/validate.js')
let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let promise = require("../../../assets/scripts/promise.js");
let choose = require("../../../assets/scripts/upload.js");
let app = getApp();
let getInputStream = function(url) {
  let str = personnel.BASE + personnel.personnel.getPhotoIo + "?photoPath=";
  let defaultPath = "/assets/images/upload.png";
  return str + url || defaultPath
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    customer: {
      name: "",
      status: "",
      idcard: "",
      mobile: "",
      path: ''
    },
    cardInfo: {
      title: "",
      cardName: ""
    },
    customers: null,
    card: null,
    peopleNums: null,
    peopleNum: null,
    flag: true,
    vipid: "",
    customers2: null,
    bindFlag: false,
    giveFlag: null,
    userBindFlag: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userName = null;
    var cardType = null;
    var cardTypeId = null;
    var cardNo = null;
    var phoneNum = null;
    var photoPath = null;
    var path = null;
    var peopleNums = null;
    var giveFlag = options.giveFlag || "N";
    var isTrue = options.isTrue;
    if (wx.getStorageSync("vipid")) {
      this.setData({
        vipid: wx.getStorageSync("vipid")
      })
    }
    if (options.data != null) {
      app.globalData.customers = null;
      var data = JSON.parse(options.data);
      app.globalData.peopleNums = (data.peopleNums - data.ticketOrderCardDetailList.length)
      var userBindFlag = app.globalData.userBindFlag;
      this.setData({
        peopleNum: data.peopleNums,
        giveFlag: giveFlag,
        userBindFlag: userBindFlag
      })
      app.globalData.cardNum = data.cardNo
      app.globalData.isPeopleNums = (data.peopleNums - data.ticketOrderCardDetailList.length)
      var cardInfo = {
        title: data.ticketName,
        cardName: "月湖雕塑公园"
      }
      app.globalData.cardInfo = cardInfo
      var ticketOrderCardDetailList = data.ticketOrderCardDetailList;
      if (ticketOrderCardDetailList.length > 0) {
        var customers = this.data.customers;
        var customers2 = this.data.customers2;
        if (customers == null) {
          customers = new Array();
        }
        if (customers2 == null) {
          customers2 = new Array();
        }
        for (var i = 0; i < ticketOrderCardDetailList.length; i++) {
          var status = "未绑定";
          if (ticketOrderCardDetailList[i].bindFlg != "") {
            status = "已绑定"
          }
          var customer = {
            name: ticketOrderCardDetailList[i].certificateName,
            status: status,
            idcard: ticketOrderCardDetailList[i].certificateNo,
            mobile: ticketOrderCardDetailList[i].phone,
            path: getInputStream(ticketOrderCardDetailList[i].photoPath),
            index: customers.length,
            photoPath: ticketOrderCardDetailList[i].photoPath,
          };
          customers[customers.length] = customer;
          customers2[customers2.length] = customer;
        }
        this.setData({
          customers: customers
        })
        this.setData({
          customers2: customers2
        })
      }
      app.globalData.customers = this.data.customers;
      app.globalData.customers2 = this.data.customers2;
    }
    this.setData({
      peopleNums: app.globalData.peopleNums,
      cardInfo: app.globalData.cardInfo
    })
    if (options.userName != null) {
      userName = options.userName;
      cardType = options.cardType;
      cardTypeId = options.cardTypeId;
      cardNo = options.cardNo;
      phoneNum = options.phoneNum;
      photoPath = options.photoPath;
      path = options.path;
      peopleNums = app.globalData.peopleNums;
    }
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
      var status = "未绑定";
      if (isTrue == "true") {
        status = "已绑定";
      }
      var customer = {
        name: userName,
        status: status,
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
      var customers2 = app.globalData.customers2;
      this.setData({
        customers: customers,
        customers2: customers2
      })
      app.globalData.customers = customers
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
  /**
   * 请添加家庭成员
   */
  navigatorAddPeople: function() {
    wx.redirectTo({
      url: '../addPeople/addPeople?userBindFlag=' + this.data.userBindFlag,
    })
  },
  _deleteEvent: function() {
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
  bindSubmit: function(e) {
    var cardNo = app.globalData.cardNum; //获取卡号
    var bindFlag = this.data.bindFlag; //是否绑定微信号
    var vipId = e.detail.value.vipId || ''; //推荐人id
    var peopleFlag = true;
    var flag = false;
    var giveFlag = this.data.giveFlag;
    if (this.data.customers != null) {
      if (this.data.customers.length < app.globalData.isPeopleNums) {
        peopleFlag = false
        wx.showToast({
          title: '请添加本卡所有家庭成员',
          icon: 'none',
          duration: 2000,
        })
      }
      if (peopleFlag) {
        var customers = this.data.customers; //家庭成员列表
        var customers2 = this.data.customers2;
        if (customers != null) { //判断家庭成员是否为空  
          //判断用户有没有填写推荐人
          if (vipId != '') {
            let params1 = {
              url: personnel.personnel.checkRefferrerId,
              data: {
                customerCodeId: vipId,
              }
            }
            //请求地址判断推荐人id存不存在
            request.http(params1).then(res => {
              var code = res.code;
              if (code == 0) {
                flag = true;
                if (flag) {
                  var bindWeiXinFlag = "N" //绑定微信号                
                  if (customers2 != null) {
                    for (var i = 0; i < customers.length; i++) {
                      //删除人
                      customers.splice(i, 1)
                    }
                  }
                  var ticketOrderCardDetailList = [];
                  for (var i = 0; i < customers.length; i++) {
                    console.log(customers[i].status)
                    if (customers[i].status == "已绑定") {
                      bindWeiXinFlag = 'Y';
                    } else {
                      bindWeiXinFlag = 'N';
                    }
                    ticketOrderCardDetailList[i] = {
                      certificateName: customers[i].name, //姓名
                      certificateTypeId: customers[i].cardTypeId, //证件类型id
                      certificateNo: customers[i].idcard, //证件号
                      phone: customers[i].mobile, //手机号
                      photoPath: customers[i].photoPath, //服务器上用户照片路径
                      bindWeiXinFlag: bindWeiXinFlag //绑定微信号
                    }
                  }
                  let params = {
                    url: personnel.personnel.activateTicketOrderCard,
                    data: {
                      cardNo: cardNo,
                      recommenCustomerHeadId: vipId,
                      ticketOrderCardDetailList: ticketOrderCardDetailList,
                      giveFlag: giveFlag
                    }
                  }
                  //请求地址判断推荐人id存不存在
                  request.http(params).then(res => {
                    wx.hideLoading();
                    console.log(res)
                    var code = res.code;
                    if (code == 0) {
                      wx.showModal({
                        title: '提示',
                        content: '激活成功',
                        cancelText: '回主页',
                        confirmText: '去查看',
                        success: function(res) {
                          if (res.confirm) {
                            wx.switchTab({
                              url: '../../personnel/personnel',
                            })
                          } else if (res.cancel) {
                            wx.switchTab({
                              url: '../../index/index',
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
                    // wx.hideLoading();
                  });
                }
              } else {
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          } else {
            flag = true;
            if (flag) {
              var bindWeiXinFlag = "N" //绑定微信号
              if (customers2 != null) {
                for (var i = 0; i < customers.length; i++) {
                  //删除人
                  customers.splice(i, 1)
                }
              }
              var ticketOrderCardDetailList = [];
              for (var i = 0; i < customers.length; i++) {
                console.log(customers[i].status)
                if (customers[i].status == "已绑定") {
                  bindWeiXinFlag = 'Y';
                } else {
                  bindWeiXinFlag = 'N';
                }
                ticketOrderCardDetailList[i] = {
                  certificateName: customers[i].name, //姓名
                  certificateTypeId: customers[i].cardTypeId, //证件类型id
                  certificateNo: customers[i].idcard, //证件号
                  phone: customers[i].mobile, //手机号
                  photoPath: customers[i].photoPath, //服务器上用户照片路径
                  bindWeiXinFlag: bindWeiXinFlag //绑定微信号
                }
              }
              let params = {
                url: personnel.personnel.activateTicketOrderCard,
                data: {
                  cardNo: cardNo,
                  recommenCustomerHeadId: vipId,
                  ticketOrderCardDetailList: ticketOrderCardDetailList,
                  giveFlag: giveFlag
                }
              }
              //请求地址判断推荐人id存不存在
              request.http(params).then(res => {
                wx.hideLoading();
                var code = res.code;
                if (code == 0) {
                  wx.showModal({
                    title: '提示',
                    content: '激活成功',
                    cancelText: '回主页',
                    confirmText: '去查看',
                    success: function(res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '../../personnel/personnel',
                        })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '../../index/index',
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
            }
          }
        } else {
          wx.showToast({
            title: '请添加家庭成员',
            icon: 'none',
            duration: 2000
          })
        }
      }
    } else {
      wx.showToast({
        title: '请添加家庭成员',
        icon: 'none',
        duration: 2000
      })
    }
  }
})