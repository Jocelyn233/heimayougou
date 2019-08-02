//  引入request
import { request } from '../../request/index'

Page({

  data: {
    goodsInfo: {}
  },

  onLoad(options) {
    const { goods_id } = options
    request({
      url: '/goods/detail',
      data: { goods_id }
    })
      .then(res => {
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
    const current=urls[index]
    wx.previewImage({
      urls, // 要进行预览的图片集合
      current, // 从第几张开始预览
    })
  }
})