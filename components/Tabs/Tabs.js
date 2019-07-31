// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 对父组件传递过来的数据进行描述 type类型为数组 默认值为:[]
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击触发父组件的自定义事件 把当前的index值传过去
    handleIndexChange(e){
      const {index}=e.currentTarget.dataset
      this.triggerEvent('changeIndex',{index})
    }
  }
})
