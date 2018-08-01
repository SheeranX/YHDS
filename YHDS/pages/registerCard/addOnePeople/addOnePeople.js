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
    pageType: 0,
    photoPath: '',
    vipid: "",
    tempFilePaths: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      pageType: options.pageType
    })
    var that = this;
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
    var pageType = this.data.pageType;
    var userName = e.detail.value.userName;
    var cardType = this.data.cardType;
    var cardTypeId = this.data.cardTypeId;
    var cardNo = e.detail.value.cardNo;
    var phoneNum = e.detail.value.phoneNum;
    var certificateTypeId = this.data.cardTypeId;
    var photoPath = this.data.photoPath;
    var path = this.data.path;
    if (userName != '' && cardType != '' && cardNo != '' && phoneNum != '' && photoPath != '') {
      var isCardNo = validate.isIdCard(cardNo);
      //验证身份证是否合法
      if (isCardNo) {
        let checkIdCardParams = {
          url: personnel.personnel.queryCardStatus,
          data: {
            certificateNo: cardNo,
            certificateTypeId: certificateTypeId
          }
        };
        request.http(checkIdCardParams).then(
          res => {
            var code = res.code;
            wx.hideLoading();
            if (code == 60004) {
              //验证手机号是否合法
              var isPhoneNum = validate.isPhoneNo(phoneNum);
              if (isPhoneNum) {
                //办理会员卡界面
                if (pageType == 1) {
                  const app = getApp();
                  var peopleNums = app.globalData.peopleNums;
                  app.globalData.peopleNums = peopleNums - 1;
                  wx.redirectTo({
                    url: '../addCustomer/addCustomer?userName=' + userName + "&cardType=" + cardType + "&cardTypeId=" + cardTypeId + "&cardNo=" + cardNo + "&phoneNum=" + phoneNum + "&photoPath=" + photoPath + "&path=" + path
                  })
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
                title: res.message,
                icon: 'none',
                duration: 2000
              })
            }
          }
        );
      } else {
        wx.showToast({
          title: '身份证不合法',
          icon: 'none',
          duration: 2000,
        })
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
        wx.hideLoading();
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
      }
    )
  }
})