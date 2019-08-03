// pages/cart/index.js
Page({

  data: {
    // 收货信息
    addressInfo: {},
    // 购物车数据 在onShow的时候获取赋值
    cart:{}
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
  }
})