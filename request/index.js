export const request = (params) => {
    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    return new Promise((reslove, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success:(result)=>{
                reslove(result.data.message)
            },
            fail:(error)=>{
                reject(error)
            }
        })
    })
}