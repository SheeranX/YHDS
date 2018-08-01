// Components/customerCard/customerCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     isHide:{
       type:Boolean,
       value:false
     },
    obj: {
      type: Object,
      value: {
        name: "姓名",
        status: "未绑定",
        idcard: "身份证",
        mobile: "手机号",
        path:null,
        index: 0
      }
    },
  },

  /**
   * 组件的初始数据
   */
  /**
   * 组件的方法列表
   */
  methods: {
    _deleteEvent(e) {
      const app = getApp();
      app.globalData.index = this.properties.obj.index;
      this.triggerEvent("delEvent",e);
    },
	_addPhotoEvent() {
      const app = getApp();
      app.globalData.index = this.properties.obj.index;
      this.triggerEvent("addEvent");
    }
  }
})
