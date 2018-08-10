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
    let nickname ="";
    wx.getUserInfo({
      success:function(res){
        console.log(res)
        _this.data.name = res.userInfo.nickName;
        nickname = res.userInfo.nickName;
      }
    })    
    console.log(options)
    let isSend = options.isSend;
    let id = options.id;

    if (isSend && id!="")
    {
      _this.setData({
        name: nickname,
        vipid: id
        });
    }
    else if (isSend && id=="")
    {
      _this.setData({
        name: nickname,
        vipid: ''
      });
    }
    else
    {
      let vip = options.vipID || ""
      wx.setStorageSync("vipid", vip)
      _this.setData({
        name: options.name || "",
        flag: false
      });
    }
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
      title: '月湖雕塑公园',
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