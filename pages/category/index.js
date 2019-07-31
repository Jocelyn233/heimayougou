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
    currentIndex: 0,
    // 滚动条距离顶部的高度
    scrollTop: 0
  },
  // 用于存放返回的结果
  Cates: [],
  onLoad() {
    // this.getCateInfo()
    // 判断一下本地内存 有没有数据
    // 没有再发送请求
    let cates = wx.getStorageSync("cates")
    // console.log(typeof cates);  若本地中
    if (!cates) { // 不存在的情况
      this.getCateInfo()  // 发请求 拿数据
    } else { // 如果数据存在
      if (Date.now() - cates.time > 1000 * 20) { // 判断一下是否过期
        // 过期的情况
        this.getCateInfo() // 重新发请求
      } else {
        // 没有过期 把数据拿出来渲染即可
        this.Cates = cates.data;
        let leftMenuList = this.Cates.map((v, i) => ({ cat_name: v.cat_name, cat_id: v.cat_id }));
        let rightGoodsList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    }
  },
  getCateInfo() {
    request({
      url: "/categories"
    })
      .then(res => {
        this.Cates = res;
        // 请求回来的时候 把数据存在本地 同时存入时间 用于判断时间是否过期
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
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
    // 修改数据要用this.setData
    this.setData({
      scrollTop: 0
    })
  }
})
