var api = require('../../../config/api.js');
var util = require('../../../util/util.js');
var log = require('../../../util/log.js')
var app = getApp()

Page({
    data: {
        email: '',
        Emails: ["qq.com", "163.com", "gmail.com", "hotmail.com", "vip.qq.com", "vip.163.com", "yahoo.com"],
        emailIndex: 0,
        mdToken: '',
        mdUserId: '',
    },

    onShow: function() {

    },
    onLoad: function() {
        let that = this
        getApp().launchPromise.then(() => {
            util.checkLogin().then(function(res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                log.info("onLoad logined " + JSON.stringify(that.data));
            }).catch(function(res) {
                log.info(JSON.stringify(res))
            })
        })
    },

    checkEmail: function(email) {
        if (!email || !email.match(/^[0-9a-zA-z_]+@(vip.)?(yahoo|126|163|189|foxmail|gmail|hotmail|icloud|live|msn|netease|outlook|qq|sina|sohu).(com|net)$/)) {
            wx.showModal({
                title: '错误',
                content: '请输入邮箱'
            });
            return false
        }
        return true
    },

    bindEmailChange: function(e) {
        this.setData({ emailIndex: e.detail.value })
    },

    bindEmailInput: function(e) {
        this.setData({ email: e.detail.value })
    },

    submitForm: function() {
        let that = this
        if (!this.checkEmail(that.data.email + "@" + that.data.Emails[that.data.emailIndex])) {
            return
        }
        log.info(JSON.stringify(that.data))
        util.request(api.GetInvitationCodeUrl, { email: that.data.email + "@" + that.data.Emails[that.data.emailIndex], uid: that.data.uid }, 'GET')
            .then(function(res) {
                if (res.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 1000
                    })
                }
            });

    }
})