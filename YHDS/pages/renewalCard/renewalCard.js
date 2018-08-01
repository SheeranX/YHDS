let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {},
    orderid: "",
    cardCount: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid = options.cardno;
    let _this = this;
    _this.setData({
      orderid: orderid
    })
    console.log(orderid);
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
    const _this = this;

    let params = {
      url: personnel.personnel.getTicketCardForRecharge,
      method: "post",
      data: {
        cardNo: _this.data.orderid
      }
    }

    request.http(params).then(res => {
      wx.hideLoading()
      if (res.code != 0) {
        _this.setData({
          isUnbind: true
        })
      }
      else {
        _this.setData({
          cardInfo: res,
        });
      }
    });
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
  /**
   * 增加数量
   */
  addCount: function () {
    var cardCount = this.data.cardCount;
    var countPrice = this.data.countPrice;
    var cardPrice = this.data.cardPrice;
    this.setData({
      cardCount: cardCount + 1
    })
    cardCount = this.data.cardCount;
    this.setData({ countPrice: cardPrice * cardCount })
  },
  /**
   * 减少数量
   */
  deleteCount: function () {
    var countPrice = this.data.countPrice;
    var cardPrice = this.data.cardPrice;
    var cardCount = this.data.cardCount;
    if (cardCount > 1) {
      this.setData({
        cardCount: cardCount - 1
      })
      cardCount = this.data.cardCount;
      this.setData({ countPrice: cardPrice * cardCount })
    }
  },
  submit: function () {
    const _this = this;
    let params = {
      url: personnel.personnel.rechargeTicketCard,
      method: "post",
      data: {
        "cardNo": _this.data.orderid,
        "number": _this.data.cardCount
      }
    }

    request.http(params).then(res => {
      return request.http({
        url: personnel.personnel.pay,
        data: {
          cardOrderNo: res.cardOrderNo
        }
      })
    }).then(res => {
      wx.hideLoading()
      if (res.code == 0) {
        let params = {
          nonceStr: res.nonceStr,
          prepayId: res.prepayId,
          signType: res.signType,
          timeStamp: res.timeStamp,
          paySign: res.paySign
        }

        wx.requestPayment({
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.prepayId,
          signType: params.signType,
          paySign: params.paySign,
          success: res => {
            wx.showModal({
              title: '',
              content: '支付成功，已续卡',
              cancelText:"回主页",
              confirmText:"去查看",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../personnel/purchasedCard/purchasedCard',
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta:1
                  })
                }
              }
            })
          },
          fail: error => {
            wx.showToast({
              title: '续卡失败，请重试',
              icon: 'none'
            })
          }
        })
      }
      else {
        wx.showToast({
          title: '续卡失败，请重试',
          icon: 'none'
        })
      }
    })
  }
})