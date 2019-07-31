// 引入发请求的方法
import { request } from '../../request/index'

Page({
  data: { // 放页面中需要用到的数据
    // 渲染到页面的数组
    goodsList: [],
    // tab栏中需要显示的数据
    tabsList: [
      { id: 0, value: '综合', isActive: true },
      { id: 1, value: '销量', isActive: false },
      { id: 2, value: '价格', isActive: false }
    ]
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
  total: 1,
  onLoad(params) {
    // console.log(params);  // {cid: "6"} 路由参数
    this.goodsListInfo.cid = params.cid
    request({
      url: '/goods/search',
      data: this.goodsListInfo
    })
      .then(res => {
        this.setData({
          goodsList: res.goods
        })
        this.total = res.total
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 子组件触发的自定义事件
  handleIndexChange(e) {
    const { index } = e.detail
    // 遍历数组 当index等于传过来的index值得 isActive为true 否则为false
    // 取到数组
    const { tabsList } = this.data
    tabsList.forEach((v,i)=> {
        if(i===index){
          v.isActive=true
        }else{
          v.isActive=false
        }
    })
    // 改变data中的数据
    this.setData({
      tabsList
    })
  }
})