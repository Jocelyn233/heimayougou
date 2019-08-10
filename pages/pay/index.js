import { request } from "../../request/index"

Page({

  data: {
    // 收货信息
    addressInfo: {},
    // 购物车数据 在onShow的时候获取赋值
    cart: {},
    totalPrice: 0
  },
  // 点击获取用户收货信息按钮
  // 有三种情况 
  // 1.用户点击确定(返回值true) 
  // 2.用户点击取消(返回值false) 
  // 3.用户没有进行收权操作(返回值undefined)
  handleUserInfo() {
    wx.getSetting({
      // 先验证 用户是否进行过授权操作
      success(res1) {
        const scopeAddress = res1.authSetting['scope.address']
        // 未授权 scopeAddress 为undefined
        // 授权过 scopeAddress 为true
        // console.log(scopeAddress);
        if (scopeAddress === undefined || scopeAddress === true) {
          // 调用收货地址
          wx.chooseAddress({
            success(res2) {
              // console.log(res2)
              // 拿到数据后存到本地 all 先将地址拼接好再存入
              res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
              wx.setStorageSync('address', res2)
            }
          })
        } else {
          // 点击了 取消 授权 需要重新调用授权窗口 进行授权
          // console.log("取消授权");
          wx.openSetting({ // 进行授权的窗口
            success: () => {
              console.log("打开了授权窗口 进行授权");
              wx.chooseAddress({
                success(res3) {
                  // console.log(res3)
                  // 拿到数据后存到本地
                  res3.all = res3.provinceName + res3.cityName + res3.countyName + res3.detailInfo
                  wx.setStorageSync('address', res3)
                }
              })
            }
          })
        }
      }
    })

  },
  onShow() {
    // 在页面显示的时候 就把本地存的收货信息赋值给addressInfo
    const addressInfo = wx.getStorageSync("address") || {}
    const cart = wx.getStorageSync("cart") || {}
    this.setData({
      addressInfo,
      cart
    })
    this.setCart(cart)
  },
  // 封装一个计算购物车总数和总价格的函数 同时把修改后的cart存入本地
  setCart(cart) {  // 传入修改后的cart
    // 1.先把cart从对象转为数组
    let cartArr = Object.values(cart)
    // 2.全选按钮的值由cartArr数组中的每一项是否选中决定 全部选中 值才为true
    let isAllChecked = cartArr.every(v => v.checked)
    // 3.遍历数组 将选中状态的商品 单价*数量 再进行相加 得到总价格
    // 3.1 先让总价格 总数量的初始值为0 再进行相加
    let totalPrice = 0
    let totalNum = 0
    // 4.进行数组的遍历
    cartArr.forEach(v => {
      if (v.checked) { // v.checked 当该商品状态为选中时 才进行计算
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      }
      // 5.改变data中的数据 即渲染在页面的数据
      this.setData({
        isAllChecked, totalPrice, totalNum, cart
      })
      // 6.同时将修改后的cart重新存入本地
      wx.setStorageSync('cart', cart)
    });
  },
  // 点击结算
  handleToPay() {
    // 跳转到授权页面 需要判断一下 如果有token值就不需要跳了 没有token值再跳转到授权页面去取
    const token = wx.getStorageSync("token");
    if (!token) {  // 若不存在token token为空字符串
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    } else {
      // 有token的情况 直接走流程 带着token值发请求
      // 0. 设置请求头
      // const header = { Authorization: token };
      // 1.把cart转成数组
      const cartArr = Object.values(this.data.cart)
      // console.log(cartArr);
      // 所需要的参数 goods 数组
      let goods = []
      // 遍历cartArr 取到需要的参数
      cartArr.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      // 收货地址
      const consignee_addr = this.data.addressInfo.all
      // 订单总价格
      const order_price = this.data.totalPrice
      // 2.发送请求 拿到订单编号
      request({
        url: "/my/orders/create",
        method: "POST",
        // header,
        data: {
          consignee_addr,
          order_price,
          goods
        }
      })
        .then(res => {
          // 里面就包含order_number
          const { order_number } = res
          // 1.拿到order_number 就可以发起预支付
          // 微信预支付 需要以下参数
          request({
            url: "/my/orders/req_unifiedorder",
            method: "POST",
            // header,
            data: {
              order_number
            }
          })
            .then(res => {
              const payData = res.pay
              // 发起微信支付接口
              wx.requestPayment({
                ...payData,
                success: (result) => {
                  // console.log(result)  
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000
                  })  
                  // 支付成功后 需要查询一下订单状态
                  request({
                    url:'/my/orders/chkOrder',
                    method:"POST",
                    // header,
                    data:{
                      order_number
                    }
                  })
                  .then(res=>{
                    // console.log(res); // 支付成功
                    // 订单支付成功 就跳转到订单查询页面 查询刚刚支付的订单信息

                  })
                  .catch(err=>{
                    console.log(err);
                  })
                },
                fail: () => {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'success',
                    duration: 1000
                  })  
                },
              });

            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
})