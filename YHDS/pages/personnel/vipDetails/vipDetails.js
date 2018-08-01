// pages/personnel/vipDetails/vipDetails.js

let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let server = require("../../../utils/interface.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetail:{},
    detailList:[]
  },
  /**
   * 页面内方法
   */
  _delEvent(e) {
    let id = e.detail.currentTarget.dataset.idx;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cardno = options.id;
    const _this = this;
    let params = {
      url: personnel.personnel.getCardDetailInfo,
      method: 'post',
      data: {
        "cardNo": cardno
      }
    }

    request.http(params).then(res=>{
      wx.hideLoading()
      console.log(res);
      let list = res.cardDetail.detailList;
      let arr = [];

      let getInputStream = function (url) {
        let str = server.BASE + personnel.personnel.getPhotoIo + "?photoPath=";
        return str + url
      }
      for (let i = 0; i < list.length; i++) {
        let obj = {}

        obj.idcard = list[i].certificateNo;
        obj.name = list[i].certificateName;
        obj.mobile = list[i].phone;
        obj.path = getInputStream(list[i].photoPath);
        obj.status = list[i].bindFlg

        arr.push(obj);
      }

     // console.log(arr);
      _this.setData({
        cardDetail: res.cardDetail,
        detailList:arr
      });
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
  
  }
})