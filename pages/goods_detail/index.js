//  引入request
import { request } from '../../request/index'

Page({

  data: {
    goodsInfo: {}
  },
  // 全局变量 完整的商品信息
  goodsAllInfo: {},

  onLoad(options) {
    const { goods_id } = options
    request({
      url: '/goods/detail',
      data: { goods_id }
    })
      .then(res => {
        // 将完整的商品信息 存在全局变量 goodsAllInfo 中
        this.goodsAllInfo = res
        console.log(this.goodsAllInfo);
        // 把页面中需要用到的4项数据传到data中
        this.setData({
          goodsInfo: {
            pics: res.pics,
            goods_price: res.goods_price,
            goods_name: res.goods_name,
            goods_introduce: res.goods_introduce
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 点击轮播图图片 进行预览
  handleImage(e) {
    // 拿到被点击的index
    const { index } = e.currentTarget.dataset
    const urls = this.data.goodsInfo.pics.map(v => {
      return v.pics_big
    })
    const current = urls[index]
    wx.previewImage({
      urls, // 要进行预览的图片集合
      current, // 从第几张开始预览
    })
  },
  // 点击加入购物车 将商品信息存在本地
  handleCart() {
    // 点击 加入购物车 的时候  先判断一下 此时缓存中是否已经有该数据 没有 num=1 有 num++
    //  若本地中没有 cart 令它的值空
    let cart = wx.getStorageSync("cart") || {}
    const goods_id = this.goodsAllInfo.goods_id
    if (!cart[goods_id]) {
      // 将cart存到本地 给cart这个对象加属性
      cart[goods_id]=this.goodsAllInfo
      // 给 cart[goods_id] 这个对象加属性 num
      cart[goods_id].num=1
      cart[goods_id].checked=true  // 该项是否选中
      // cart[num]=1
      // wx.setStorageSync("cart", cart)
    } else {
      // console.log("cart存在本地");
      // 若 cart 已经存在于本地 则进行数量的增加
      cart[goods_id].num++
      // 增加完数量 再存入本地
      // wx.setStorageSync("cart", cart)
    }
    // 无论本地存储有没有都要执行的代码 更新本地存储的信息 给出提示
    wx.setStorageSync("cart", cart)
    wx.showToast({
      title: '添加成功',
      icon: 'none',
      // true 用户无法操作页面的按钮 遮罩层 蒙版  
      mask: true
    });
  }
})