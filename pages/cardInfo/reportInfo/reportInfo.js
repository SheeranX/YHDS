// pages/cardInfo/reportInfo/reportInfo.js

let request = require("../../../assets/scripts/request.js");
let personnel = require("../../../utils/interface.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentSelect:0,
    swiper: ["检票明细", "账户明细", "积分明细","推荐明细"],
    condition:["全部","收入","支出"],
    dateModal:false,
    pointModal:false,
    accountModal:false,
    recommandModal:false,
    orderid:'',
    checkDetails:[],
    recommandDetails: [],
    date: '',
    endDate:"",
    recommandStartDate:"",
    recommandEndDate:""
  },
/**
 * 页面内方法
 */
  //点击切换时重新请求检票明细
  requestCheck:function(){
    let _this = this;
    let params = {
      url: personnel.personnel.getCheckDetail,
      method: 'post',
      data: {
        cardNo: _this.data.orderid,
        startDate: "",
        endDate: ""
      }
    }

    request.http(params).then(res => {
      wx.hideLoading()
      let _this = this;
      _this.setData({
        checkDetails: res.checkDetailList
      });
    }).catch(error => {
      console.log(error);
    });
  },
  //点击切换时重新请求推荐明细
  requestRecommand:function(){
    let _this = this;
    let params = {
      url: personnel.personnel.getRecommendDetail,
      method: 'post',
      data: {
        cardNo: _this.data.orderid,
        startDate: "",
        endDate: ""
      }
    }

    request.http(params).then(res => {
      wx.hideLoading()
      let _this = this;
      _this.setData({
       recommandDetails: res.detailList
      });
    }).catch(error => {
      console.log(error);
    });
  },
  //tab 栏切换
  clickTab: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
     
      switch (that.data.currentTab){
        case 0:
          that.requestCheck();
        break;
        case 1:
          console.log('2');
          break;
        case 2:
         console.log("3");
         break;
        case 3:
          that.requestRecommand();
          break;
      }

    }
  },
  //账户明细弹窗
  clickAccount:function(){
    let self = this;
    self.setData({
      accountModal:!self.data.accountModal
    });
  },
  clickRadio:function(e){
    var self = this;
    self.setData({
      currentSelect: e.currentTarget.dataset.radio
    });
  },
  //日期弹窗
  clickDate(){
    let self = this;
    self.setData({
      dateModal: !self.data.dateModal
    })
  },
  clickPoint:function(){
    let self = this;
    self.setData({
      pointModal: !self.data.pointModal
    })
  },
  //推荐弹窗
  clickRecommand:function(){
    let self = this;
    self.setData({
      recommandModal: !self.data.recommandModal
    });
  },
  //时间日期处理
  bindDateChange:function(e){
    console.log(e);
    this.setData({
      date: e.detail.value
    })
  },
  bindEndDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
  },
  bindrecommandDateChange:function(e){
    this.setData({
      recommandStartDate: e.detail.value
    })
  },
  bindrecommandEndDateChange:function(e){
    this.setData({
      recommandEndDate: e.detail.value
    })
  },
  checkConfirm:function(){
    let _this = this;
    let start = new Date(Date.parse(_this.data.date));
    let end = new Date(Date.parse(_this.data.endDate));
    if(start==""||end=="")
    {
      wx.showToast({
        title: '日期不能为空',
        icon: 'none'
      })
    }
    if(start>end)
    {
      wx.showToast({
        title: '日期不能大于开始时间',
        icon:'none'
      })

      return;
    }
    else
    {
      let params = {
        url: personnel.personnel.getCheckDetail,
        method: 'post',
        data: {
          cardNo: _this.data.orderid,
          startDate: start,
          endDate: end
        }
      }

      request.http(params).then(res => {
        wx.hideLoading()
        _this.setData({
          checkDetails: res.checkDetailList
        });
      }).catch(error => {
        console.log(error);
      });
    }
    this.setData({
      dateModal: !_this.data.dateModal
    })
  },
  recommandConfirm:function(){
    let _this = this;
    let start = new Date(Date.parse(_this.data.recommandStartDate));
    let end = new Date(Date.parse(_this.data.recommandEndDate));
    if (start == "" || end == "") {
      wx.showToast({
        title: '日期不能为空',
        icon: 'none'
      })
    }
    if (start > end) {
      wx.showToast({
        title: '日期不能大于开始时间',
        icon: 'none'
      })

      return;
    }
    else {
      let params = {
        url: personnel.personnel.getRecommendDetail,
        method: 'post',
        data: {
          cardNo: _this.data.orderid,
          startDate: start,
          endDate: end
        }
      }

      request.http(params).then(res => {
        wx.hideLoading()
        _this.setData({
          recommandDetails: res.detailList
        });
      }).catch(error => {
        console.log(error);
      });
    }
    this.setData({
      recommandModal: !_this.data.recommandModal
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let _this  =this;
  let id = options.id;

  _this.setData({
    orderid:id
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
    this.requestCheck();
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