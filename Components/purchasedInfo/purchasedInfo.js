// Components/purchasedInfo/purchasedInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
       type:Object,
       value:{
         "cardKind": "",
         "cardNo": "",
         "cardOrderNo": "",
         "cardPW": "",
         "customerCodeId": 0,
         "orderCardType": "",
         "orderStatus": "",
         "orderTime": "",
         "payStatus": "",
         "peopleNums": 0,
         "recommenCustomerHeadId": "",
         "ticketTypeName": "",
         "ticketValidEndTime": "",
         "totalOrderAmount": 0,
         "totalRecommenSum": 0,
         "validityPeriod": "",
         "flag":false,
        //  dxy添加
         "giveFlg":"",
         "showDetailFlag":"",
         "showGiveFlag":"",
         "receiverNickName":""
       }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   operateBtn:{widthdraw:"退订",detail:"查看明细",send:"赠送好友"}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _withdraw:function(e){
      this.triggerEvent("withdraw",e);
    },
    _detail:function(e){
      this.triggerEvent("detail",e);
    },
    _present:function(e){
      this.triggerEvent("present",e);
    }
  },
  /**
   * 使用外部样式
   */
 
})
