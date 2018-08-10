// pages/cardInfo/editInfo/editInfo.js
let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let validate = require("../../../utils/validate.js");
let promise = require("../../../assets/scripts/promise.js");
let choose = require("../../../assets/scripts/upload.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:"",
    cardNo:'',
    path:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("USER_INFO"))
    let obj = JSON.parse(wx.getStorageSync("USER_INFO"));
   this.setData({
     mobile:obj.mobile,
     cardNo: obj.id,
     path: obj.path
   });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  formSubmit:function(e){
    let _this = this;

    if (validate.isPhoneNo(e.detail.value.mobile))
    {
      let paras = {
        url: personnel.personnel.updateCardFingerDataInfo,
        data: {
          photoPath: this.data.path.split('=')[1],
          cardOwnerPhone: e.detail.value.mobile,
          certificateNo: _this.data.cardNo
        }
      }

      request.http(paras).then(res => {
        wx.hideLoading();
        if (res.code == '0') {
          wx.showToast({
            title: res.message
          })
        }
        else {
          wx.showToast({
            title: "修改失败，请重试"
          })
        }
      })
        .catch(error => {
          wx.showToast({
            title: "修改失败，请重试"
          })
        })
    }
    else
    {
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
    }

  //  request.http()
  },
  changeImg:function(){
    let _this = this;
    let upload = promise.wxPromise(wx.uploadFile);
    choose.uploadImg({
      url: personnel.BASE + personnel.personnel.uploadPhoto
    }).then(res=>{
      let tempFilePaths = res.tempFilePaths;

      return upload({
        url: personnel.BASE + personnel.personnel.uploadPhoto,
        filePath: tempFilePaths[0], //单张图片
        name: 'file',
        header: {
          'content-Type': 'multipart/form-data'
        }
      })
    }).then(res=>{
      console.log(res)
      wx.hideLoading();
      let resJson = JSON.parse(res);
      let str = _this.data.path.split('=')[0];
      let tempPath = str + "=" + resJson.photoPath;
      if (resJson.code =="0")
      {
        _this.setData({
          path: tempPath
        })
      }
      else
      {
        console.log(res.code);
      }
    }).catch(error=>{
      wx.hideLoading();
      console.log(error);
    })
  }

})