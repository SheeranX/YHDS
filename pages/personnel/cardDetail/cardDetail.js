// pages/personnel/cardDetail/cardDetail.js
let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let server = require("../../../utils/interface.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer: {},
    orderInfo:{},
    customerInfo:[],
    validDateList:[]
  },
  _delEvent(e){
    let id = e.detail.currentTarget.dataset.idx;
  },
  copyText:function(){
    let _this = this;
    wx.setClipboardData({
      data: _this.data.orderInfo.cardNo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let _this = this;
    _this.setData({
      id:id
    })
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
    let id = _this.data.id
    let getInputStream = function (url) {
      let str = server.BASE + personnel.personnel.getPhotoIo + "?photoPath=";
      let defaultPath = "/assets/images/timg.jpg";
      return str + url || defaultPath
    }
    let params = {
      url: personnel.personnel.getMyCardBaseInfo,
      method: 'post',
      data: {
        "cardOrderNo": id
      }
    }
    request.http(params).then(res => {
      wx.hideLoading()
      let data = res.cardDetailList
      console.log(res);

      let customerInfo = function () {
        let info = data;
        let arr = [];
        for (let i = 0; i < info.length; i++) {
          var obj = {}

          obj.idcard = info[i].certificateNo;
          obj.name = info[i].certificateName;
          obj.mobile = info[i].phone;
          obj.path = getInputStream(info[i].photoPath);//photoPath
          obj.status = info[i].bindFlg


          arr.push(obj);
        }
        console.log(arr);
        return arr;
      }



      _this.setData({
        orderInfo: res.cardBaseInfo,
        customerInfo: customerInfo(),
        validDateList: res.validDateList.length == 0 ? false : res.validDateList
      })
    })
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