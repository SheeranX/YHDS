// pages/activate/activate.js
var validate = require('../../utils/validate.js')
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");
let promise = require("../../assets/scripts/promise.js");
let choose = require("../../assets/scripts/upload.js");
let upload = promise.wxPromise(wx.uploadFile);
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
    cardInfo: {
      ticketTypeName: "",
      cardKind: "",
      cardNo: "",
      cardAccountValue: "0"
    },
    bindFlag: true,
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
    tempFilePaths: '',
    customers2: null,
    giveFlag: "",
    userBindFlag: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    var ticketTypeName = options.ticketTypeName;
    var cardAccountValue = options.cardAccountValue;
    var cardNo = options.cardNo;
    var giveFlag = options.giveFlag || "N"; //判断是否为赠送跳转
    _this.setData({
      giveFlag: giveFlag
    });
    var userBindFlag = app.globalData.userBindFlag;
    if (userBindFlag) {
      this.setData({
        bindFlag: false
      })
    }
    this.setData({
      userBindFlag: userBindFlag
    })
    var ticketOrderCardDetailList = JSON.parse(options.ticketOrderCardDetailList);
    var length = ticketOrderCardDetailList.length;
    this.setData({
      isAddPeopleNum: ticketOrderCardDetailList.length
    })
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
        var customer = {
          name: ticketOrderCardDetailList[i].certificateName,
          status: "已绑定",
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
    var giveFlag = this.data.giveFlag;
    var flag = false;
    //单人
    if (peopleNums <= 1) {
      var userName = this.data.userName;
      var cardType = this.data.cardType;
      var cardTypeId = this.data.cardTypeId;
      var that = this;
      var path = this.data.path;
      var photoPath = this.data.photoPath;
      var flag = true;
      if (userName != "" && cardType != "" && cardNo != "" && phoneNum != "" && photoPath != "") {
        var isPhoneNum = validate.isPhoneNo(phoneNum);
        if (!isPhoneNum) {
          flag = false;
          wx.showToast({
            title: '手机号码不合法',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if (flag) {
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
                        ticketOrderCardDetailList: ticketOrderCardDetailList,
                        giveFlag: giveFlag
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
                          },
                          fail: function() {
                            wx.switchTab({
                              url: '../personnel/personnel',
                            })
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
                            url: '../personnel/personnel',
                          })
                        } else if (res.cancel) {
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }
                      },
                      fail: function() {
                        wx.switchTab({
                          url: '../personnel/personnel',
                        })
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
          }
        }
      } else {
        wx.showToast({
          title: '请填写所有必填项',
          icon: 'none',
          duration: 2000,
        })
      }
    }
    var peopleFlag = true;
    if (this.data.customers != null) {
      if (this.data.customers.length < this.data.addPeopleCount) {
        peopleFlag = false
        wx.showToast({
          title: '请添加本卡所有家庭成员',
          icon: 'none',
          duration: 2000,
        })
      }
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
                if (bindFlag) {
                  bindWeiXinFlag = 'Y';
                }
                if (customers2 != null) {
                  for (var i = 0; i < customers.length; i++) {
                    //删除人
                    customers.splice(i, 1)
                  }
                }
                var ticketOrderCardDetailList = [];
                for (var i = 0; i < customers.length; i++) {
                  bindWeiXinFlag = "N";
                  if (customers[i].status == "已绑定") {
                    bindWeiXinFlag = "Y";
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
                            url: '../personnel/personnel',
                          })
                        } else if (res.cancel) {
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }
                      },
                      fail: function() {
                        wx.switchTab({
                          url: '../personnel/personnel',
                        })
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
          flag = true;
          if (flag) {
            var bindWeiXinFlag = "N" //绑定微信号
            if (bindFlag) {
              bindWeiXinFlag = 'Y';
            }
            if (customers2 != null) {
              for (var i = 0; i < customers.length; i++) {
                //删除人
                customers.splice(i, 1)
              }
            }
            var ticketOrderCardDetailList = [];
            for (var i = 0; i < customers.length; i++) {
              bindWeiXinFlag = "N";
              if (customers[i].status == "已绑定") {
                bindWeiXinFlag = "Y";
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
                        url: '../personnel/personnel',
                      })
                    } else if (res.cancel) {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  },
                  fail: function() {
                    wx.switchTab({
                      url: '../personnel/personnel',
                    })
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
    var userBindFlag = app.globalData.userBindFlag;
    if (userBindFlag) {
      wx.showToast({
        title: '当前微信已绑定会员卡',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        bindFlag: true
      })
    }
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
        let img = tempFilePaths[0].split('.').pop() || "gif";
        if (img.toLowerCase == 'gif') {
          wx.showToast({
            title: '图片格式不能为gif',
            icon: 'none'
          })
          return
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
    var flag = true;
    var bindFlag = this.data.bindFlag;
    //非空判断
    if (userName != "" && cardType != "" && cardNo != "" && phoneNum != "" && photoPath != "") {
      if (bindFlag) {
        if (this.data.customers != null) {
          for (var i = 0; i < this.data.customers.length; i++) {
            if (this.data.customers[i].status == "已绑定") {
              flag = false;
              this.setData({
                bindFlag: false
              })
              wx.showToast({
                title: '已有家庭用户绑定该微信号',
                icon: 'none',
                duration: 2000
              })
              break;
            }
          }
        }
      }
      var isPhoneNum = validate.isPhoneNo(phoneNum);
      if (!isPhoneNum) {
        flag = false;
        wx.showToast({
          title: '手机号码不合法',
          icon: 'none',
          duration: 2000
        })
      }
      if (flag) {
        if (isPhoneNum) {
          var isAddPeopleNum = that.data.isAddPeopleNum;
          var addPeopleCount = that.data.addPeopleCount;
          if (isAddPeopleNum < addPeopleCount) {
            var customers = that.data.customers;
            if (customers == null) {
              customers = new Array();
            }
            var customer = {};
            if (bindFlag) {
              customer = {
                name: userName,
                status: "已绑定",
                idcard: cardNo,
                mobile: phoneNum,
                path: path,
                index: customers.length,
                cardTypeId: cardTypeId,
                photoPath: photoPath,
                delPath: '../../assets/images/delete.png'
              };
            } else {
              customer = {
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
            }
            customers[customers.length] = customer;
            that.setData({
              customers: customers
            })
            that.setData({
              isAddPeopleNum: (isAddPeopleNum + 1)
            })
            var peoples = that.data.customers;
            that.setData({
              userName: "",
              cardType: "",
              path: "",
              cardNo: "",
              phoneNum: ""
            })
          } else {
            wx.showToast({
              title: '此卡最多只能添加' + addPeopleCount + '人',
              icon: "none",
              duration: 2000
            })
          }
        }
      }
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