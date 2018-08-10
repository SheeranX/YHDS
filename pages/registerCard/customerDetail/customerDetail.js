// pages/registerCard/customerDetail/customerDetail.js
var utils = require('../../../utils/util.js')
var validate = require('../../../utils/validate.js')
let request = require("../../../assets/scripts/request.js");
let promise = require("../../../assets/scripts/promise.js");
let personnel = require("../../../utils/interface.js");
let choose = require("../../../assets/scripts/upload.js");
let upload = promise.wxPromise(wx.uploadFile);
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {},
    cardTypes: [],
    cardType: null,
    cardTypeIds: [],
    cardTypeId: null,
    path: '',
    photoPath: '',
    isTrue: true,
    vipid: "",
    tempFilePaths: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var cardInfo = {
      title: options.title,
      cardName: options.cardName,
      price: options.price,
      ticketId: options.ticketId
    }
    if (wx.getStorageSync("vipid")) {
      this.setData({
        vipid: wx.getStorageSync("vipid")
      })
    }
    this.setData({
      cardInfo: cardInfo
    })
    let params = {
      url: personnel.personnel.queryCardType
    };
    request.http(params).then(
      res => {
        var code = res.code;
        if (code == 0) {
          var item = [];
          item = res.certificateTypeList;
          var cardTypes = [];
          for (var i = 0; i < item.length; i++) {
            cardTypes[i] = item[i].certificateType;
          }
          var cardTypeIds = [];
          for (var i = 0; i < item.length; i++) {
            cardTypeIds[i] = item[i].certificateTypeID;
          }
          that.setData({
            cardTypes: cardTypes,
            cardTypeIds: cardTypeIds
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
   * 证件类型选择器选择事件
   */
  bindPickerChange: function(e) {
    var cardTypes = this.data.cardTypes;
    var cardTypeIds = this.data.cardTypeIds;
    this.setData({
      cardType: cardTypes[e.detail.value],
      cardTypeId: cardTypeIds[e.detail.value]
    })
  },
  bindSubmit: function(e) {
    var userName = e.detail.value.userName; //姓名
    var cardType = this.data.cardType; //卡类型
    var cardNo = e.detail.value.cardNo; //卡号
    var phoneNum = e.detail.value.phoneNum; //手机号
    var vipId = e.detail.value.vipId; //推荐人ID
    var photoPath = this.data.photoPath; //照片路径
    var ticketId = this.data.cardInfo.ticketId; //要购买的票id
    var cardTypeId = this.data.cardTypeId; //卡类型id
    //当必选项不为空时
    if (userName != '' && cardType != '' && cardNo != '' && phoneNum != '' && photoPath != '') {
      const app = getApp();
      var that = this;
      var flag = this.data.isTrue;
      var isPhoneNum = validate.isPhoneNo(phoneNum);
      if (isPhoneNum) {
        //绑定微信
        if (flag) {
          //有推荐人
          if (vipId != '') {
            let params = {
              url: personnel.personnel.checkVip,
              data: {
                customerCodeId: vipId
              }
            };
            request.http(params).then(
              res => {
                var code = res.code;
                if (code == 0) {
                  let params2 = {
                    url: personnel.personnel.saveOrder,
                    data: {
                      ticketTypeId: ticketId,
                      entryPersonFlag: "Y",
                      recommenCustomerHeadId: vipId,
                      ticketOrderCardDetailList: [{
                        certificateName: userName,
                        certificateTypeId: cardTypeId,
                        certificateNo: cardNo,
                        phone: phoneNum,
                        photoPath: photoPath,
                        bindWeiXinFlag: "Y"
                      }]
                    }
                  };
                  request.http(params2).then(
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
                                  wx.hideLoading();
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
                            wx.hideLoading();
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
                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            );
            //没有推荐人
          } else {
            let noVipIdParams = {
              url: personnel.personnel.saveOrder,
              data: {
                ticketTypeId: ticketId,
                entryPersonFlag: "Y",
                recommenCustomerHeadId: "",
                ticketOrderCardDetailList: [{
                  certificateName: userName,
                  certificateTypeId: cardTypeId,
                  certificateNo: cardNo,
                  phone: phoneNum,
                  photoPath: photoPath,
                  bindWeiXinFlag: "Y"
                }]
              }
            };
            request.http(noVipIdParams).then(
              res => {
                console.log(noVipIdParams)
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
                            wx.hideLoading();
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
                      wx.hideLoading();
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
          }
        } //不绑定微信
        else {
          //有推荐人
          if (vipId != '') {
            let params = {
              url: personnel.personnel.checkVip,
              data: {
                customerCodeId: vipId
              }
            };
            request.http(params).then(
              res => {
                var code = res.code;
                if (code == 0) {
                  let params2 = {
                    url: personnel.personnel.saveOrder,
                    data: {
                      ticketTypeId: ticketId,
                      entryPersonFlag: "Y",
                      recommenCustomerHeadId: vipId,
                      ticketOrderCardDetailList: [{
                        certificateName: userName,
                        certificateTypeId: cardTypeId,
                        certificateNo: cardNo,
                        phone: phoneNum,
                        photoPath: photoPath,
                        bindWeiXinFlag: "N"
                      }]
                    }
                  };
                  request.http(params2).then(
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
                                  wx.hideLoading();
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
                                      wx.hideLoading();
                                    }
                                  })
                                },
                                'fail': function(res) {}
                              })
                            } else {
                              wx.hideLoading();
                              wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          }
                        );
                      } else {
                        wx.hideLoading();
                        wx.showToast({
                          title: res.message,
                          icon: 'none',
                          duration: 2000,
                        })
                      }
                    }
                  );
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            );
            //没有推荐人
          } else {
            let noVipIdParams = {
              url: personnel.personnel.saveOrder,
              data: {
                ticketTypeId: ticketId,
                entryPersonFlag: "Y",
                recommenCustomerHeadId: "",
                ticketOrderCardDetailList: [{
                  certificateName: userName,
                  certificateTypeId: cardTypeId,
                  certificateNo: cardNo,
                  phone: phoneNum,
                  photoPath: photoPath,
                  bindWeiXinFlag: "N"
                }]
              }
            };
            request.http(noVipIdParams).then(
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
                            wx.hideLoading();
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
                                wx.hideLoading();
                              }
                            })
                          },
                          'fail': function(res) {}
                        })
                      } else {
                        wx.hideLoading();
                        wx.showToast({
                          title: res.message,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    }
                  );
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            );
          }
        }
      } else {
        wx.showToast({
          title: '手机号不合法',
          icon: 'none',
          duration: 2000,
        })
      }
    } else {
      wx.showToast({
        title: '请填写所有必选项',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 显示绑定微信
   */
  showThis: function() {
    this.setData({
      isTrue: false
    })
  },
  /**
   * 隐藏绑定微信
   */
  hideThis: function() {
    this.setData({
      isTrue: true
    })
  },
  /**
   * 添加照片
   */
  addPhoto: function() {
    var that = this;
    choose.uploadImg({
      url: personnel.BASE + personnel.personnel.uploadPhoto
    }).then(
      res => {
        console.log(res);
        let tempFilePaths = res.tempFilePaths;
        let img = tempFilePaths[0].split('.').pop() || "gif";
        if (img.toLowerCase == 'gif') {
          wx.showToast({
            title: '图片格式不能为gif',
            icon: 'none'
          })
          return;
        }
        that.setData({
          tempFilePaths: tempFilePaths[0]
        })
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function(res) {
            var canvasWidth = res.width
            var canvasHeight = res.height;
            var ratio = 2;
            while (canvasWidth > 200 || canvasHeight > 200) {
              //比例取整
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            const ctx = wx.createCanvasContext('attendCanvasId');
            ctx.drawImage(tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
            ctx.draw();
            setTimeout(
              function() {
                wx.canvasToTempFilePath({
                  canvasId: 'attendCanvasId',
                  height: canvasHeight,
                  width: canvasWidth,
                  success: function success(res) {
                    //显示图片
                    console.log(res.tempFilePath)
                    wx.uploadFile({
                      url: personnel.BASE + personnel.personnel.uploadPhoto,
                      filePath: res.tempFilePath,
                      name: 'file',
                      header: {
                        'content-Type': 'multipart/form-data'
                      },
                      success: function(res) {
                        wx.hideLoading()
                        var data = JSON.parse(res.data)
                        console.log(data)
                        var code = data.code;
                        if (code == 0) {
                          var photoPath = data.photoPath;
                          var tempFilePaths = that.data.tempFilePaths;
                          that.setData({
                            path: tempFilePaths
                          })
                          that.setData({
                            photoPath: photoPath
                          })
                        } else {
                          wx.showToast({
                            title: data.message,
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                })
              }, 200)
          }
        })
      }
    ).catch(error => {
      console.log(error);
    })
  }
})