Page({

  data: {
    // 收货信息
    addressInfo: {},
    // 购物车数据 在onShow的时候获取赋值
    cart:{},
    totalPrice:0
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
  }
})