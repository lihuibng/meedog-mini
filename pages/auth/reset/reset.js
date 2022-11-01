const util = require("../../../util/util");
const api = require("../../../config/api")
var log = require('../../../util/log.js')
var app = getApp();
Page({
  data: {
    username: '',
    oldPassword: '',
    password: '',
    authCode: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    getApp().launchPromise.then(() => {
      let that = this;
      that.data.authCode = wx.getStorageSync('mdAuthCode')
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  startNext: function () {
    let that = this;
    log.info(JSON.stringify(that.data))
    util.request(api.UpdatePasswordUrl, {
      email: that.data.username,
      password: that.data.password,
      authCode: that.data.authCode
    },
      "POST",
      "application/x-www-form-urlencoded").then(function (res) {
        if (res.code == 200) {
          log.info(JSON.stringify(res))
        }
      })
  },

  bindEmailInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  bindOldPasswordInput: function (e) {
    this.setData({
      oldPassword: e.detail.value
    });
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  confirmPasswordInput: function (e) {
    if (e.detail.value != this.data.password) {
      wx.showToast({
        title: '新密码不一致',
      })
    }
  },

  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
    }
  }
})