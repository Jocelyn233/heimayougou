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
  // 总页数
  TotalPages: 1,
  onLoad(params) {
    // console.log(params);  // {cid: "6"} 路由参数
    this.goodsListInfo.cid = params.cid
    // console.log(this.goodsListInfo.cid);
    this.getGoodsList()
  },
  getGoodsList() {
    // console.log(this.goodsListInfo);
    request({
      url: '/goods/search',
      data: this.goodsListInfo
    })
      .then(res => {
        // console.log(res);
        this.setData({
          // 为了做加载下一页 改成拼接
          goodsList: [...this.data.goodsList, ...res.goods]
        })
        // 计算总页数 用总的数量/每页的容量 向上取整
        this.TotalPages = Math.ceil(res.total / this.goodsListInfo.pagesize);
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 触底时触发 小程序的生命周期函数
  onReachBottom() {
    // console.log('触底了');
    // 先判断一下还是否有下一页数据 如果没有 就提示无更多数据 有再发送请求加载
    if (this.goodsListInfo.pagenum >= this.TotalPages) {
      // 如果当前的页码大于等于总的页码数 说明已经没有更多数据了 给提示
      wx.showToast({
        title: '已无更多数据',
        icon: 'none'
      })
    } else {
      // 还有下页数据
      this.goodsListInfo.pagenum++;
      this.getGoodsList();
    }
  },
  // 子组件触发的自定义事件
  handleIndexChange(e) {
    const { index } = e.detail
    // 遍历数组 当index等于传过来的index值得 isActive为true 否则为false
    // 取到数组
    const { tabsList } = this.data
    tabsList.forEach((v, i) => {
      if (i === index) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })
    // 改变data中的数据
    this.setData({
      tabsList
    })
  },
  // 下拉刷新时触发的函数
  // onPullDownRefresh(){
  //   console.log('下拉刷新');
  // }

})