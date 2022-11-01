var api = require('../../../config/api.js');
var util = require('../../../util/util.js')
var log = require('../../../util/log.js')

var app = getApp()

Page({
  data: {
    mdToken: '',
    uid: '',
    username: '',
    password: '',
    code: '',
    email: '',
    loginErrorCount: 0
  },

  onLoad: function () {
    getApp().launchPromise.then(() => {
      let that = this;
      util.checkLogin().then(function (res) {
        that.data.mdToken = app.globalData.mdToken;
        that.data.uid = app.globalData.uid;
        log.info("onLoad logined " + JSON.stringify(that.data));
        wx.switchTab({
          url: '../../../pages/search/index/index'
        });
      }).catch(function (res) {
        log.info("auth login + " + res)
      })
    })
  },

  onReady: function () {
  },

  onShow: function () {
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  startLogin: function () {
    var that = this;
    log.info("login + " + JSON.stringify(that.data))
    util.loginBackend(that)
  },

  bindEmailInput: function (e) {
    this.setData({
      email: e.detail.value,
      username: e.detail.value
    });
  },

  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  clearInput: function (e) {
    switch (e.currentTarget.id) {

      case 'clear-username':
        this.setData({
          username: ''
        });
        break;

      case 'clear-password':
        this.setData({
          password: ''
        });
        break;

      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})