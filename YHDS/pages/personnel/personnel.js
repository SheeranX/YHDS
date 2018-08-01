// pages/personnel/personnel.js
let request = require("../../assets/scripts/request.js");
let personnel =require("../../utils/interface.js");
let QRCode = require('../../assets/scripts/weapp.qrcode.min.js');

let utils = require("../../utils/util.js");

let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: null, 
    isUnbind: false,
    isModal:true,
    brightness:0
  },
  /**
   * 页面内方法
   */
  showModal:function(){
    //控制modal弹出层
    let isModal = !this.data.isModal;
    let _this = this;

    _this.setData({
      isModal :isModal,
    });
    //请求参数
    if(!isModal)
    {
      wx.getScreenBrightness({
        success:res=>{
          _this.setData({
            brightness:res.value
          })
        }
      })
      let params = {
        url: personnel.personnel.getQrCode,
        method: "post",
      }
      //一个封装的请求方法
      request.http(params).then(res => {
        wx.hideLoading()
       // console.log(res.cardNoList[0].cardNo);
        wx.setScreenBrightness({
          value: 1
        })
        //生成二维码
        QRCode({
          width: 120,
          height: 120,
          canvasId: 'myQrcode',
          text: res.cardNoList[0].cardNo,
        });
      });
    }
    else
    {
      wx.setScreenBrightness({
        value: _this.data.brightness
      })
    }

  },
  goDetail(){
    let _this = this;
    wx.navigateTo({
      url: '../cardInfo/reportInfo/reportInfo?id=' + _this.data.cardInfo.cardNo,
    })
  },
  recommand(){
    
  },
  unbind:function(){
    const _this = this;
    console.log(_this.data.cardInfo.cardNo);
    wx.showModal({
      title: '提示信息',
      content: '是否确认解绑？',
      success: function (res) {
        if (res.confirm) {
          let params = {
            url: personnel.personnel.unbindTicketCard,
            method: "post"
          }
          request.http(params).then(res => {
            wx.hideLoading()
            _this.setData({
              isUnbind:true,
              cardInfo:null
            })
          });
        } else if (res.cancel) 
        {
          console.log('用户点击取消')
        }
      }
    })
  },
  goRenew:function(){
    let _this = this;
    if (!_this.data.cardInfo)
     {
       wx.showToast({
         title: '会员卡未绑定，无法续卡',
         icon:'none',
         duration:1000
       })
       return
     }
     else
     {
       wx.navigateTo({
         url: '../renewalCard/renewalCard?cardno=' + _this.data.cardInfo.cardNo,
       })
     }
  },
  getCardBaseInfo:function(){
    const _this = this;
    let params = {
      url: personnel.personnel.getCardBaseInfo,
      method: "post"
    }

    request.http(params).then(res => {
      wx.hideLoading()
      if (!res.cardBaseInfo) {
        _this.setData({
          isUnbind: true
        })
      }
      else {
        _this.setData({
          cardInfo: res.cardBaseInfo,
          isUnbind: false
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let _this = this;
    _this.getCardBaseInfo();
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
  onShareAppMessage: function (ops) {
     
  }
})