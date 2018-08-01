//index.js
//获取应用实例

const app = getApp()
let flag = true;
let img = null;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navbar:'',
    imagePath:"../../assets/images/qrcode.jpg",
    maskHidden:true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750;
      var scaleH = 1200 / 750;
      var width = res.windowWidth;
      var height = res.windowWidth;
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("get info fail" + e);
    }
    return size;
  },
  settextFir: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var textFir = "长按发送给朋友/长按关注公众号";
    //console.log(textFir);
    context.setFontSize(12);
    context.setTextAlign("center");
    context.fillText(textFir, size.w / 2, size.h*0.98);
    context.stroke();
  },
  createNewImg: function () {
    var that = this;
    var size = that.setCanvasSize();
    var context = wx.createCanvasContext('myCanvas');
    var path = that.data.imagePath;
   // var imageCode = that.data.imagesCode;
    if (flag) {
      context.drawImage(path, 0, 0, size.w, size.h);
      //context.drawImage(imageCode, size.w / 2 - 45, size.h * 0.55, size.w * 0.25, size.w * 0.2);
      this.settextFir(context);
      // this.settextSec(context);
      context.draw();

      wx.showToast({
        title: '二维码生成中...',
        icon: "loading",
        duration: 2000
      })

      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            var temp = res.tempFilePath;
            that.setData({
              imagePath: temp,
              canvasHidden: false,
              maskHidden: true
            });
            img = that.data.imagePath;
            wx.previewImage({
              current: img,
              urls: [img],
            })
            that.setData({
              flag: false
            });
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 2000);
      flag = false;
    } 
    else {
      wx.previewImage({
        current: img,
        urls: [img],
      })
    }
  },
  onLoad: function () {
    
  },
  onReady:function(){
    
  },
})
