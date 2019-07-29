// 引入request方法
import { request } from '../../request/index.js'

Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },
  onLoad() {  // 页面加载完成
    // 记得加this
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 拿到轮播图图片
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    })
      .then(res => {
        this.setData({
          swiperList: res
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 拿到分类信息
  getCateList() {
    request({
      url: "/home/catitems"
    })
      .then(res => {
        // console.log(res);
        this.setData({
          cateList: res
        })
      })
  },
  // 拿到楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    })
    .then(res=>{
      this.setData({
        floorList:res
      })
    })
    .catch(err=>{
      console.log(err);
    })
  }
})
