// pages/search/index.js
Page({
  data: {
    candidateCount: 0,
    candidates: [],
    recommend_candidates: []
  },

  onRecommend: function (options) {
    util.request(api.RecommendApi).then(function (res) {
      console.log(res);
      if (res.code === 200) {
        data.banner = res.data.advertiseList
        that.setData(data);
      }
    });
  },
  onSearch: function (options) {
    util.request(api.CandidateSearchApi).then(function (res) {
      console.log(res);
      if (res.code === 200) {
        data.banner = res.data.advertiseList
        that.setData(data);
      }
    });
  },
  onLoad: function (options) {

  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
    return {
      title: '米小狗',
      desc: '米小狗婚恋交友',
      path: '/search/index/index'
    }
  }
})