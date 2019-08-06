// 引入 request
import { request } from "../../request/index"


Page({

  data: {

  },
  getUserInfo(e) {
    // 获取用户信息 里面就有4个参数：encryptedData iv rawData signature
    // console.log(e);
    // 1.将参数解构出来
    const { encryptedData, iv, rawData, signature } = e.detail
    // 微信内置的登录接口 登录后 可以获得最后一个参数 code
    wx.login({  // 异步的
      success(res) {
        // console.log(res);
        const { code } = res
        // 拿到了所有的参数 可以发送请求 拿token值
        const data = { encryptedData, iv, rawData, signature, code }
        request({
          url: "/users/wxlogin",
          method: "POST",
          data,
        })
          .then(res => {
            // res 中就包括token值
            const { token } = res
            // 拿到了token token需要在支付页面使用
            // 所以需要把token存在本地 方便其他页面使用
            wx.setStorageSync("token", token);
            // 授权成功后 需要重新跳回支付页面
            wx.navigateBack({
              // 跳回上一个页面
              delta: 1
            });
          })
          .catch(err => {
            console.log(err);
          })
      }
    })

  }
})