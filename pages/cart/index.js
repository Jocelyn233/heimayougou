// pages/cart/index.js
Page({

  data: {
    // 收货信息
    addressInfo: {},
    // 购物车数据 在onShow的时候获取赋值
    cart: {},
    // 全选按钮的状态
    isAllChecked: false,
    // 总数量
    totalNum: 0,
    // 总价格
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
  // 单选框的状态改变时
  handleChecked(e) {
    // console.log(e);
    const { id } = e.currentTarget.dataset
    // 将对应的商品checked值取反
    // console.log(id);
    let { cart } = this.data  // 从数据中拿到cart值
    // console.log(cart[id]);
    cart[id].checked = !cart[id].checked  // 将对应的checked值取反
    // 最后调用setCart方法将改变后的cart重新存入本地
    this.setCart(cart)
  },
  // 点击增加/减少按钮时
  handleNum(e) {
    const { operation, id } = e.currentTarget.dataset
    let { cart } = this.data
    // 当数量只剩1 并且还 点击减少按钮时 弹出是否删除
    if (operation === -1 && cart[id].num === 1) {
      wx.showModal({  // 异步操作 
        title: '提示',
        content: '您确定要删除吗？',
        success: (res) => {
          if (res.confirm) {
            delete cart[id]
            // 不是箭头函数 this就不是指向最外层函数
            this.setCart(cart)
            // debugger
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      cart[id].num += operation
      this.setCart(cart)
    }

  },
  // 点击全选按钮 让每个商品的状态跟着改变
  handleAllChecked(e) {
    let { cart, isAllChecked } = this.data
    isAllChecked = !isAllChecked
    // console.log(this.isAllChecked);
    // 把isAllChecked的状态循环遍历到每个商品
    // cart是对象 循环对象
    for (var key in cart) {
      cart[key].checked = isAllChecked
    }
    // 再改变cart的值并存到内存中
    this.setCart(cart)
  },
  // 点击结算按钮 地址、购物车有选中状态的商品才进行跳转
  handleToPay() {
    // 1.把地址和商品信息解构出来
    let { addressInfo, cart } = this.data
    // 2.将对象转成数组
    let cartArr = Object.values(cart)
    console.log(cartArr);
    // 3.用some遍历数组 看下有没有选中状态的商品 一个为true 返回值就为true
    const hasCheckedCart = cartArr.some(v => v.checked)
    // 4.从上到下 先判断有没有地址
    if (!addressInfo.userName) {
      // 没有收货地址
      wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
        mask: true
      });
    } else if (!hasCheckedCart) {
      // 没有 选中要购买的商品 
      wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
        mask: true
      });
    }else{
      // 地址 选中商品都有了 才进行跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }
  }
})