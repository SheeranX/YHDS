//index.js
//获取应用实例
let request = require("../../assets/scripts/request.js");
let personnel = require("../../utils/interface.js");

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
    maskHidden:true,
    findAdvertiseList:[]
  },

  goNotice:function(e){
    let url = e.currentTarget.dataset.url;
    if(url)
    {
      wx.setStorageSync("URL", url);
      wx.navigateTo({
        url: 'notice/notice',
      })
    }
    else
      return
    console.log(e)
  },

  onLoad: function () {
    
  },
  onReady:function(){
    
  },
  onShow:function(){
  let _this = this;
  let paras = {
      url: personnel.personnel.findAdvertiseList
    }
   request.http(paras).then(res=>{
     wx.hideLoading();
     _this.setData({
       findAdvertiseList:res
     })
   }).catch(error=>{
     wx.hideLoading();
     console.log(error);
   })
  },
  onShareAppMessage:res=>{
  
  }
})
