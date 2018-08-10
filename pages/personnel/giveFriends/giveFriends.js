// pages/personnel/giveFriends/giveFriends.js

let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:false,
    orderInfo: {},
    userInfo:{},
    name: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let orderid = options.cardOrderNo;
    let _this = this;
    let params = {
      url:personnel.personnel.giveFriend,
      method:"post",
      data:{
        cardOrderNo: orderid,
        cardNo: id
      }
    }
    console.log(params);
    request.http(params).then(res=>{
      wx.hideLoading()
      console.log(res);
      _this.setData({
        orderInfo:res
      });
    });

    _this.data.userInfo = app.globalData.userInfo;
    _this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(app.globalData.userInfo);
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
    let _this = this;
    let paras = _this.data.orderInfo.cardNo + "," + _this.data.orderInfo.cardPW;

    return {
      title: '月湖雕塑公园会员卡',
      path: 'pages/activate/acivatebypwd/acivatebypwd?data=' + paras,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})