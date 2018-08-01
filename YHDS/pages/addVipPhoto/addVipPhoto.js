// pages/addVipPhoto/addVipPhoto.js
let app = getApp();
var utils = require('../../utils/util.js')
var validate = require('../../utils/validate.js')
let request = require("../../assets/scripts/request.js");
let choose = require("../../assets/scripts/upload.js");
let personnel = require("../../utils/interface.js");
let promise = require("../../assets/scripts/promise.js");
let upload = promise.wxPromise(wx.uploadFile);
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
    customers: [{
      name: "777",
      status: "未绑定",
      idcard: "610113164745464654",
      mobile: "13245665361651"
    }],
    cardInfo: {
      ticketTypeName: "",
      cardKind: "",
      cardNo: "",
      cardAccountValue: "0"
    },
    cardNum: '',
    photoPath: '',
    path: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    console.log(data)
    var ticketTypeName = data.ticketName;
    var cardNum = data.cardNo;
    this.setData({
      cardNum: cardNum
    })
    var cardInfo = {
      title: ticketTypeName,
      cardName: "月湖雕塑公园"
    };
    this.setData({
      cardInfo: cardInfo
    })
    var customers = data.ticketOrderCardDetailList;
    var customers2 = [];
    if (customers != null) {
      for (var i = 0; i < customers.length; i++) {
        console.log(getInputStream(customers[i].photoPath))
        var customer = {};
        if (customers[i].photoPath != '') {
          customer = {
            name: customers[i].certificateName,
            status: "未绑定",
            idcard: customers[i].certificateNo,
            mobile: customers[i].phone,
            index: i,
            path: getInputStream(customers[i].photoPath),
            photoPath: customers[i].photoPath
          };
        } else {
          customer = {
            name: customers[i].certificateName,
            status: "未绑定",
            idcard: customers[i].certificateNo,
            mobile: customers[i].phone,
            index: i,
            path: '../../assets/images/upload.png',
            photoPath: customers[i].photoPath
          };
        }
        customers2[customers2.length] = customer;
      }
      this.setData({
        customers: customers2
      })
    } else {
      wx.showToast({
        title: '此卡未查询到信息',
        icon: 'none',
        duration: 2000
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
  /**
   * 添加照片
   */
  _addPhotoEvent: function() {
    var that = this;
    var index = app.globalData.index;
    choose.uploadImg({
      url: personnel.BASE + personnel.personnel.uploadPhoto
    }).then(
      res => {
        let tempFilePaths = res.tempFilePaths
        that.setData({
          path: tempFilePaths
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
          var customers = that.data.customers;
          var customer = {
            name: customers[index].name,
            status: "未绑定",
            idcard: customers[index].idcard,
            mobile: customers[index].mobile,
            index: index,
            path: that.data.path,
            photoPath: photoPath
          };
          customers[index] = customer;
          that.setData({
            customers: customers
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
  },
  /**
   * 提交
   */
  submit: function() {
    var customers = this.data.customers;
    var cardInfo = this.data.cardInfo;
    var isPhotoPath = false;
    var collectionPhotoInfoList = [];
    for (var i = 0; i < customers.length; i++) {
      if (customers[i].photoPath != null) {
        isPhotoPath = true;
        var collectionPhotoInfo = {
          photoPath: customers[i].photoPath,
          certificateNo: customers[i].idcard
        };
        collectionPhotoInfoList[collectionPhotoInfoList.length] = collectionPhotoInfo
      } else {
        isPhotoPath = false;
      }
    }
    if (isPhotoPath) {
      let params = {
        url: personnel.personnel.addVipPhoto,
        data: {
          cardNo: this.data.cardNum,
          collectionPhotoInfoList: collectionPhotoInfoList
        }
      };
      request.http(params).then(res => {
        var code = res.code;
        if (code == 0) {
          wx.showModal({
            title: '提示',
            content: '更改成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
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
            duration: 2000,
          })
        }
        wx.hideLoading();
      })
    } else {
      wx.showToast({
        title: '请先添加图片',
        icon: 'none',
        duration: 2000
      })
    }
  }
})