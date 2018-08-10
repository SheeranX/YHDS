// pages/getAuth/getAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  getAuth:function(e){
    console.log(getCurrentPages())
    console.log(getCurrentPages().length-1);
    if (e.detail.errMsg =="getUserInfo:ok")
     {
      wx.navigateBack({
        delta: getCurrentPages().length - 2//跳转回上一层
      })
     }
     else
     {
       wx.showModal({
         title: '警告',
         content: '为了不影响后续使用，请您授权',
         showCancel:false
       })
     }
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
  
  }
})