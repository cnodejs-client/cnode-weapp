// // pages/index/index.js
// Page({
//   data:{},
//   onLoad:function(options){
//     // 页面初始化 options为页面跳转所带来的参数
//   },
//   onReady:function(){
//     // 页面渲染完成
//   },
//   onShow:function(){
//     // 页面显示
//   },
//   onHide:function(){
//     // 页面隐藏
//   },
//   onUnload:function(){
//     // 页面关闭
//   }
// })

//index.js
//获取应用实例
var app = getApp()

function fetchTopics(page = 1) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://cnodejs.org/api/v1/topics?tab=all&limit=20&page=${page}`,
      success(res) {
        resolve(res.data.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

Page({
  data: {
    isLoading: false,
    page: 1,
    topics: []
  },
  onPullDownRefresh() {
    this.setData({
      isLoading: true,
    })
    fetchTopics(1)
      .then(topics => {
        this.setData({
          isLoading: false,
          topics,
          page: 1,
        })
        wx.stopPullDownRefresh()
      })
  },
  onLoad() {
    this.setData({
      isLoading: true,
      windowHeight: app.globalData.windowHeight,
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    fetchTopics()
      .then(topics => {
        wx.hideToast()
        this.setData({
          isLoading: false,
          topics: topics
        })
      })
  },
  loadMore(e) {
    if (this.data.isLoading) {
      return
    }

    this.setData({
      isLoading: true
    })

    fetchTopics(this.data.page + 1)
      .then(topics => {
        this.setData({
          isLoading: false,
          page: this.data.page + 1,
          topics: [
            ...this.data.topics,
            ...topics,
          ]
        })
      })
  },
})
