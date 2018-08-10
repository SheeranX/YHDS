// pages/registerCard/addOnePeople/addOnePeople.js
var utils = require('../../../utils/util.js')
var validate = require('../../../utils/validate.js')
let request = require("../../../assets/scripts/request.js");
let choose = require("../../../assets/scripts/upload.js");
let personnel = require("../../../utils/interface.js");
let promise = require("../../../assets/scripts/promise.js");
let upload = promise.wxPromise(wx.uploadFile);
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardTypes: [],
    cardType: null,
    cardTypeIds: [],
    cardTypeId: null,
    path: '',
    photoPath: '',
    vipid: "",
    tempFilePaths: '',
    isTrue: true,
    userBindFlag: null,
    bindFlag: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var customers = app.globalData.customers;
    var bindFlag = false;
    var isTrue = true;
    if (customers != null) {
      for (var i = 0; i < customers.length; i++) {
        if (customers[i].status == "已绑定") {
          bindFlag = true;
          isTrue = false;
          break;
        }
      }
      this.setData({
        bindFlag: bindFlag,
        isTrue: isTrue
      })
    }
    var that = this;
    var userBindFlag = app.globalData.userBindFlag;
    if (userBindFlag) {
      this.setData({
        isTrue: false
      })
    }
    this.setData({
      userBindFlag: userBindFlag
    })
    if (wx.getStorageSync("vipid")) {
      this.setData({
        vipid: wx.getStorageSync("vipid")
      })
    }
    let queryCardTypeParams = {
      url: personnel.personnel.queryCardType
    };
    request.http(queryCardTypeParams).then(
      res => {
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

  bindSubmit: function(e) {
    var that = this;
    var userName = e.detail.value.userName;
    var cardType = this.data.cardType;
    var cardTypeId = this.data.cardTypeId;
    var cardNo = e.detail.value.cardNo;
    var phoneNum = e.detail.value.phoneNum;
    var certificateTypeId = this.data.cardTypeId;
    var photoPath = this.data.photoPath;
    var path = this.data.path;
    var isTrue = this.data.isTrue;
    if (userName != '' && cardType != '' && cardNo != '' && phoneNum != '' && photoPath != '') {
      var isCardNo = true;
      var isIsTrue = true;
      if (isTrue) {
        var customers = app.globalData.customers;
        if (customers != null) {
          for (var i = 0; i < customers.length; i++) {
            if (customers[i].status == "已绑定") {
              isIsTrue = false;
              wx.showToast({
                title: '已有家庭用户绑定该微信号',
                icon: 'none',
                duration: 2000,
              })
              break;
            }
          }
        }
      }
      if (isIsTrue) {
        //验证手机号是否合法
        var isPhoneNum = validate.isPhoneNo(phoneNum);
        if (isPhoneNum) {
          //办理会员卡界面
          const app = getApp();
          var peopleNums = app.globalData.peopleNums;
          app.globalData.peopleNums = peopleNums - 1;
          console.log("addOnePeople=" + isTrue)
          wx.redirectTo({
            url: '../activates/activates?userName=' + userName + "&cardType=" + cardType + "&cardTypeId=" + cardTypeId + "&cardNo=" + cardNo + "&phoneNum=" + phoneNum + "&photoPath=" + photoPath + "&path=" + path + "&isTrue=" + isTrue
          })
        } else {
          wx.showToast({
            title: '手机号不合法',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    } else {
      wx.showToast({
        title: '请填写所有项',
        icon: 'none',
        duration: 2000
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
        let tempFilePaths = res.tempFilePaths;
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
  showThis() {
    let _this = this;
    _this.setData({
      isTrue: false
    })
  },
  hideThis() {
    let _this = this;
    var userBindFlag = app.globalData.userBindFlag;
    if (userBindFlag) {
      wx.showToast({
        title: '当前微信已绑定会员卡',
        icon: 'none',
        duration: 2000
      })
    }
    var bindFlag = this.data.bindFlag;
    if (bindFlag) {
      wx.showToast({
        title: '已有家庭成员绑定当前微信',
        icon: 'none',
        duration: 2000
      })
    }
    if (!userBindFlag && !bindFlag) {
      _this.setData({
        isTrue: true
      })
    }
  },
})