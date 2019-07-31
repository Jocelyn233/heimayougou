// 在首页 有三次的异步请求 同时发送 但是有一个请求回来就会隐藏提示框
// 应该等三次请求都回来了再隐藏

var num = 0

export const request = (params) => {
    // 没发一次请求 num++
    num++
    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    // 在发送请求的时候 给个提示 加载中 加载完毕 提示消失
    wx.showLoading({
        title: "加载中"
    });
    return new Promise((reslove, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                reslove(result.data.message)
            },
            fail: (error) => {
                reject(error)
            },
            complete: () => { // 无论成功还是失败都会执行
                // 每回来一个请求 num--
                num--
                if (num === 0) {
                    // 当num等于0 的时候 即所有请求都回来了 再隐藏
                    wx.hideLoading()
                }
            }
        })
    })
}