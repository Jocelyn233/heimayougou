// 引入request方法
import { request } from "../../request/index"

Page({
  /**
     * 页面的初始数据
     */
  data: {
    // 左边菜单栏数据
    leftMenuList: [],
    // 右侧商品内容数据
    rightGoodsList: [],
    // 当前的索引 默认为0
    currentIndex: 0
  },
  // 用于存放返回的结果
  Cates: [],
  onLoad() {
    this.getCateInfo()
  },
  getCateInfo() {
    request({
      url: "/categories"
    })
      .then(res => {
        this.Cates = res;
        // leftMenuList 等于总的数组中循环出cat_name和cat_id
        let leftMenuList = res.map(v => {
          return { cat_name: v.cat_name, cat_id: v.cat_id }
        })
        let rightGoodsList = res[0].children
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 点击左侧选项时
  handleLeftItem(e) {
    // 取到传过来的index值
    const { index } = e.currentTarget.dataset
    this.setData({
      currentIndex: index
    })
    this.setData({
      rightGoodsList: this.Cates[index].children
    })
  }
})
