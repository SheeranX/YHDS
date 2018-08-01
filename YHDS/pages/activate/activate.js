// pages/activate/activate.js
var validate = require('../../utils/validate.js')
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");
let promise = require("../../assets/scripts/promise.js");
let choose = require("../../assets/scripts/upload.js");
let upload = promise.wxPromise(wx.uploadFile);
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {
      ticketTypeName: "",
      cardKind: "",
      cardNo: "",
      cardAccountValue: "0"
    },
    bindFlag: false,
    isAddPeopleNum: 0,
    addPeopleCount: 0,
    cardTypes: [],
    cardType: null,
    cardTypeIds: [],
    cardTypeId: null,
    path: '',
    photoPath: "",
    customers: null,
    userName: "",
    cardNo: "",
    phoneNum: "",
    cardNum: "",
    addFlag: true,
    tempFilePaths: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ticketTypeName = options.ticketTypeName;
    var cardAccountValue = options.cardAccountValue;
    var cardNo = options.cardNo;
    this.setData({
      cardNum: cardNo
    })
    var peopleNums = options.peopleNums;
    this.setData({
      addPeopleCount: peopleNums
    })
    if (peopleNums <= 1) {
      this.setData({
        addFlag: false
      })
    }
    var cardInfo = {
      ticketTypeName: ticketTypeName,
      cardAccountValue: cardAccountValue,
      cardNo: cardNo
    };
    this.setData({
      cardInfo: cardInfo
    })
    let params = {
      url: personnel.personnel.queryCardType,
    }
    //查询证件类型
    request.http(params).then(res => {
      var code = res.code;
      wx.hideLoading();
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
        this.setData({
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
    });
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
   * 表单提交
   */
  submit: function(e) {
    var peopleNums = this.data.addPeopleCount;
    var vipId = e.detail.value.vipId; //推荐人id
    var bindFlag = this.data.bindFlag; //是否绑定微信号
    var phoneNum = e.detail.value.phoneNum; //手机号
    var cardNo = this.data.cardNum; //获取卡号
    var flag = false;
    //单人
    if (peopleNums <= 1) {
      console.log(peopleNums)
      var userName = this.data.userName;
      var cardType = this.data.cardType;
      var cardTypeId = this.data.cardTypeId;
      var that = this;
      var path = this.data.path;
      var photoPath = this.data.photoPath;
      if (userName != "" && cardType != "" && cardNo != "" && phoneNum != "" && photoPath != "") {
        var isCardNo = validate.isIdCard(this.data.cardNo);
        if (!isCardNo) {
          wx.showToast({
            title: '身份证不合法',
            icon: 'none',
            duration: 2000
          })
        }
        var isPhoneNum = validate.isPhoneNo(phoneNum);
        if (!isPhoneNum) {
          wx.showToast({
            title: '手机号码不合法',
            icon: 'none',
            duration: 2000
          })
        }
        let params = {
          url: personnel.personnel.queryCardStatus,
          data: {
            certificateNo: this.data.cardNo,
            certificateTypeId: cardTypeId
          }
        }
        //请求地址判断推荐人id存不存在
        request.http(params).then(res => {        
          var code = res.code;
          //判断身份证是否合法
          if (code == 60004) {
            if (isPhoneNum) {
              var vipFlag = true;
              //推荐人vipId
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
                  console.log(res)
                  if (code == 0) {
                    flag = true;
                    if (flag) {
                      var bindWeiXinFlag = "N" //绑定微信号
                      if (bindFlag) {
                        bindWeiXinFlag = 'Y';
                      }
                      var ticketOrderCardDetailList = [{
                        certificateName: userName, //姓名
                        certificateTypeId: cardTypeId, //证件类型id
                        certificateNo: this.data.cardNo, //证件号
                        phone: phoneNum, //手机号
                        photoPath: photoPath, //服务器上用户照片路径
                        bindWeiXinFlag: bindWeiXinFlag //绑定微信号
                      }];

                      let params = {
                        url: personnel.personnel.activateTicketOrderCard,
                        data: {
                          cardNo: cardNo,
                          recommenCustomerHeadId: vipId,
                          ticketOrderCardDetailList: ticketOrderCardDetailList
                        }
                      }
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
                //没有推荐人Id
                flag = true;
                if (flag) {
                  var bindWeiXinFlag = "N" //绑定微信号
                  if (bindFlag) {
                    bindWeiXinFlag = 'Y';
                  }
                  var ticketOrderCardDetailList = [{
                    certificateName: userName, //姓名
                    certificateTypeId: cardTypeId, //证件类型id
                    certificateNo: this.data.cardNo, //证件号
                    phone: phoneNum, //手机号
                    photoPath: photoPath, //服务器上用户照片路径
                    bindWeiXinFlag: bindWeiXinFlag //绑定微信号
                  }];
                  let params = {
                    url: personnel.personnel.activateTicketOrderCard,
                    data: {
                      cardNo: cardNo,
                      recommenCustomerHeadId: vipId,
                      ticketOrderCardDetailList: ticketOrderCardDetailList
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
                    wx.hideLoading();
                  });
                }
              }
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
        wx.showToast({
          title: '请填写所有必填项',
          icon: 'none',
          duration: 2000,
        })
      }
    }
    var customers = this.data.customers; //家庭成员列表
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
              if (bindFlag) {
                bindWeiXinFlag = 'Y';
              }
              var ticketOrderCardDetailList = [];
              for (var i = 0; i < customers.length; i++) {
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
                  ticketOrderCardDetailList: ticketOrderCardDetailList
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
                wx.hideLoading();
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
          if (bindFlag) {
            bindWeiXinFlag = 'Y';
          }
          var ticketOrderCardDetailList = [];
          for (var i = 0; i < customers.length; i++) {
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
              ticketOrderCardDetailList: ticketOrderCardDetailList
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
        }
      }
    } else {
      if (peopleNums > 1) {
        wx.showToast({
          title: '请添加家庭成员',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  /**
   * 不选中绑定当前微信账号
   */
  unChoose: function() {
    this.setData({
      bindFlag: false
    })
  },
  /**
   * 选中绑定当前微信账号
   */
  choose: function() {
    this.setData({
      bindFlag: true
    })
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
  /**
   * 添加照片
   */
  addPhoto: function() {
    var that = this;
    choose.uploadImg({
      url: personnel.BASE + personnel.personnel.uploadPhoto
    }).then(
      res => {
        let tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePaths: tempFilePaths
        })
        return upload({
          url: personnel.BASE + personnel.personnel.uploadPhoto,
          filePath: tempFilePaths[0], //单张图片
          name: 'file',
          header: {
            'content-Type': 'multipart/form-data'
          }
        })
      }
    ).then(
      res => {
        var data = JSON.parse(res)
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
          wx.hideLoading()
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    )
  },
  /**
   * 获取姓名输入框的值
   */
  getUserName: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  /**
   * 获取证件号输入框的值
   */
  getCardNo: function(e) {
    this.setData({
      cardNo: e.detail.value
    })
  },
  /**
   * 获取手机号输入框的值
   */
  getPhoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  /**
   * 添加家庭成员
   */
  addPeople: function() {
    var userName = this.data.userName;
    var cardType = this.data.cardType;
    var cardTypeId = this.data.cardTypeId;
    var cardNo = this.data.cardNo;
    var phoneNum = this.data.phoneNum;
    var that = this;
    var path = this.data.path;
    var photoPath = this.data.photoPath;
    //非空判断
    if (userName != "" && cardType != "" && cardNo != "" && phoneNum != "" && photoPath != "") {
      var isCardNo = validate.isIdCard(cardNo);
      if (!isCardNo) {
        wx.showToast({
          title: '身份证不合法',
          icon: 'none',
          duration: 2000
        })
      }
      var isPhoneNum = validate.isPhoneNo(phoneNum);
      if (!isPhoneNum) {
        wx.showToast({
          title: '手机号码不合法',
          icon: 'none',
          duration: 2000
        })
      }
      let params = {
        url: personnel.personnel.queryCardStatus,
        data: {
          certificateNo: cardNo,
          certificateTypeId: cardTypeId
        }
      }
      //请求地址判断推荐人id存不存在
      request.http(params).then(res => {
        wx.hideLoading()
        var code = res.code;
        //判断身份证是否合法
        if (code == 60004) {
          if (isPhoneNum) {
            var isAddPeopleNum = that.data.isAddPeopleNum;
            var addPeopleCount = that.data.addPeopleCount;
            if (isAddPeopleNum < addPeopleCount) {
              var customers = that.data.customers;
              if (customers == null) {
                customers = new Array();
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
              customers[customers.length] = customer;
              that.setData({
                customers: customers
              })
              that.setData({
                isAddPeopleNum: (isAddPeopleNum + 1)
              })
              var peoples = that.data.customers;
            } else {
              wx.showToast({
                title: '此卡最多只能添加' + addPeopleCount + '人',
                icon: "none",
                duration: 2000
              })
            }
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
      wx.showToast({
        title: '请填写所有必填项',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  /**
   * 组件里的垃圾桶点击事件
   */
  _deleteEvent: function() {
    var index = app.globalData.index;
    var customers = this.data.customers;
    if (customers.length > 0) {
      customers.splice(index, 1)
    }
    this.setData({
      customers: customers
    })
    var isAddPeopleNum = this.data.isAddPeopleNum;
    if (isAddPeopleNum > 0) {
      isAddPeopleNum -= 1;
    }
    this.setData({
      isAddPeopleNum: isAddPeopleNum
    })
  }
})