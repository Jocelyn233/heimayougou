// 引入发请求的方法
import {request} from '../../request/index'

Page({
  data: { // 放页面中需要用到的数据
    // 渲染到页面的数组
    goodsList: []
  },
  // 发请求需要的参数
  goodsListInfo: {
    query: '',
    cid: '',
    // 第几页
    pagenum: 1,
    // 每页显示的条数
    pagesize: 10
  },
  total:1,
  onLoad(params) {
    // console.log(params);  // {cid: "6"} 路由参数
    this.goodsListInfo.cid = params.cid
    request({
      url:'/goods/search',
      data:this.goodsListInfo
    })
    .then(res=>{
      this.setData({
        goodsList:res.goods
      })
      this.total=res.total
    })
    .catch(err=>{
      console.log(err);
    })
  }
})