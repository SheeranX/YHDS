// pages/personnel/share/share.js

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"../../../assets/images/huiyuan.png",
    flag:true,
    name:"",
    vipid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.userInfo = app.globalData.userInfo;
    console.log(options)
    let vipid = options.vipID;
    if (options.vipID)
    {
      wx.setStorageSync("vipid", vipid)
      _this.setData({
        flag:false,
        name:options.name
      })

      console.log(wx.getStorageSync("vipid") + "++++" + vipid)
    }
   else
   {
      _this.setData({
        name: app.globalData.userInfo.nickName,
        vipid: vipid
      });
   }
   // console.log(this.userInfo);
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
    let paras = _this.data.name+","+_this.data.flag;

    return {
      title: '月湖雕塑公园小程序',
      path: '/pages/personnel/share/share?name=' + _this.data.name +'&vipID='+_this.data.vipid,
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