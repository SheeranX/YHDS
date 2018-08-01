// pages/personnel/purchasedCard/purchasedCard.js
let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");
let utils = require("../../../utils/util.js");

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    total:"",
    totalPay:"",
    isShow:false
  },
  _withdraw(e){
    let orderid = e.detail.currentTarget.dataset.cardorderno;
    let status = e.detail.currentTarget.dataset.status=="未支付"?true:false;

    console.log(e);
    let _this = this;
    let list = _this.data.order;

    for(let i=0;i<list.length;i++){
      if (list[i].cardOrderNo == orderid && list[i].orderStatus == "CANCEL_BY_USER")
      {
        wx.showToast({
          title: '已退订',
          icon:'none'
        })
        return;
      }
    }
    if(!status)//判断订单状态，选择性触发事件
    {
      let params = {
        url: personnel.personnel.returnCard,
        method: 'post',
        data: {
          "cardOrderNo": orderid
        }
      }
      wx.showModal({
        title: '',
        content: '确定退订吗',
        success: function (res) {
          if (res.confirm) {
            //退订请求
            request.http(params).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 1500
              })
              for (let i = 0; i < list.length; i++) {
                if (list[i].cardOrderNo == orderid) {
                  list[i].flag = true;
                  list[i].orderStatus = "CANCEL_BY_USER";
                  break;
                }
              }
              _this.setData({
                order: list
              });
              console.log(_this.data.order);
              console.log(list);
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      request.http({
        url: personnel.personnel.pay,
        data: {
          cardOrderNo: orderid
        }
      }).then(res=>{
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
              wx.showToast({
                title: '支付完成，已成功续卡',
                icon: "none"
              })
              _this.loadData();
            },
            fail: error => {
              wx.showToast({
                title: '支付失败，请重试',
                icon: 'none'
              })
            }
          })
        }
        else {
          wx.showToast({
            title: '支付失败，请重试',
            icon: 'none'
          })
        }
      })
    }
  },
  _detail(e){
    console.log(e);
   // let orderid = e.detail.currentTarget.dataset.cardno;
    let orderno = e.detail.currentTarget.dataset.cardorderno;
    console.log(orderno);
    wx.navigateTo({
      url: '../cardDetail/cardDetail?id=' + orderno
    })
  },
  _present(e){
    let _this = this;
    let cardno = e.detail.currentTarget.dataset.cardno;
    let list = _this.data.order;

    for (let i = 0; i < list.length; i++) {
      if (list[i].cardNo == cardno && list[i].payStatus =="未支付") {
         wx.showToast({
           title: '未完成支付，无法分享',
           icon:'none'
         })
         return;
      }
    }

    wx.navigateTo({
      url: '../giveFriends/giveFriends?id=' + cardno,
    })
  },
  loadData:function(){
    let _this = this;
    let params = {
      url: personnel.personnel.getMycard,
      method: 'post'
    }

    request.http(params).then(res => {
      wx.hideLoading()
      if (res.code == "0") {
        if (res.cardBase.cardList.length==0)
        {
            _this.setData({
              isShow:false
            })
        }
        else
        {
          _this.setData({
            order: res.cardBase.cardList,
            total: res.cardBase.cardSum,
            totalPay: res.cardBase.totalSum,
            isShow: true
          })
        }
      }
      else {
        wx.showToast({
          title: '网络开了点小差',
          icon: "none"
        })
      }
      console.log(res);
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
    this.loadData();
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