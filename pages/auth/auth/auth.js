var api = require('../../../config/api.js');
var util = require('../../../util/util.js');
var log = require('../../../util/log.js')
var app = getApp()

Page({
    data: {
        email: '',
        authCode: '',
        resetPassword: false,
        Emails: ["qq.com", "163.com", "gmail.com", "hotmail.com", "vip.qq.com", "vip.163.com", "yahoo.com"],
        emailIndex: 0,
    },

    onShow: function () {

    },
    onLoad: function () {
        let that = this
        util.checkLogin().then(function (res) {
            wx.switchTab({
                url: '../../../pages/search/index/index'
            });
        }).catch(function (res) {
            log.info(JSON.stringify(res))
        })
        if (wx.getStorageSync('registered') == true) {
            wx.redirectTo({
                url: '../../auth/register/register',
            })
        }
    },

    checkEmail: function (email) {
        if (!email || !email.match(/^[0-9a-zA-z_]+@(vip.)?(yahoo|126|163|189|foxmail|gmail|hotmail|icloud|live|msn|netease|outlook|qq|sina|sohu).(com|net)$/)) {
            wx.showModal({
                title: '错误',
                content: '请输入邮箱'
            });
            return false
        }
        return true
    },

    bindEmailChange: function (e) {
        this.setData({ emailIndex: e.detail.value })
    },

    bindEmailInput: function (e) {
        this.setData({ email: e.detail.value + "@" + this.data.Emails[this.data.emailIndex] })
    },

    submitForm: function () {
        let that = this
        if (!this.checkEmail(this.data.email)) {
            return
        }

        util.request(api.GetAuthCodeUrl, { email: this.data.email }, 'GET')
            .then(function (res) {
                if (res.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 1000
                    })
                    wx.setStorageSync('mdEmail', that.data.email)
                    wx.setStorageSync('mdAuthCode', res.data)
                    wx.redirectTo({
                        url: '../../auth/register/register',
                    })
                }
            });
    }
})