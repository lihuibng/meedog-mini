var api = require('../../../config/api.js');
var util = require('../../../util/util.js');
var log = require('../../../util/log.js')
var app = getApp()

Page({
    data: {
        showTopTips: false,
        error: "",
        email: "",
        username: "",
        password: "",
        authCode: "",
        realname: "",
        realBirthday: "1990-06-04",
        idCardBirthday: "1990-06-04",
        idCard6th: 0,
        mdToken: "",
        uid: "",
        authCodeStored: "",
        emailStored: ""
    },
    onShow: function() {},
    onLoad: function() {
        let that = this;
        getApp().launchPromise.then(() => {
            let that = this;
            util.checkLogin().then(function(res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                log.info("onLoad logined " + JSON.stringify(that.data));
                wx.switchTab({
                    url: '../../../pages/search/index/index'
                });
            }).catch(function(res) {
                log.info("login + " + res)
                if (wx.getStorageSync('registered') == true) {
                    wx.navigateTo({
                        url: '../../../pages/auth/login/login',
                    })
                }
                /*else {
                                   wx.navigateTo({
                                       url: '../../../pages/auth/auth/auth',
                                     })
                               }*/
            })
        })
    },
    bindEmailInput: function(e) {
        this.setData({ email: e.detail.value })
    },
    bindUsernameInput: function(e) {
        this.setData({ username: e.detail.value })
    },
    bindPasswordInput: function(e) {
        this.setData({
            password: e.detail.value
        })
    },
    bindAuthCodeInput: function(e) {
        this.setData({
            authCode: e.detail.value
        })
    },
    bindRealnameInput: function(e) {
        this.setData({
            realname: e.detail.value
        });
    },
    bindRealBirthdayInput: function(e) {
        this.setData({
            realBirthday: e.detail.value
        })
    },
    bindIdCardBirthdayInput: function(e) {
        this.setData({
            idCardBirthday: e.detail.value
        })
    },
    bindIdCard6thInput: function(e) {
        this.setData({
            idCard6th: e.detail.value
        })
    },
    submitForm: function(e) {
            let that = this
                /*this.selectComponent('#form').validate((valid, errors) => {
                    if (!valid) {
                        const firstError = Object.keys(errors)
                        if (firstError.length) {
                            this.setData({
                                error: errors[firstError[0]].message
                            })
                        }
                        wx.showToast({
                            title: '校验失败',
                            icon: 'failed',
                            duration: 1000
                        })
                    } else {*/
            util.request(
                    api.RegisterUrl, {
                        username: that.data.email,
                        email: that.data.email,
                        password: that.data.password,
                        authCode: that.data.authCode,
                        realname: that.data.realname,
                        realBirthday: that.data.realBirthday,
                        idCardBirthday: that.data.idCardBirthday,
                        idCard6th: that.data.idCard6th
                    },
                    "POST"
                ).then(function(res) {
                    if (res.code == 200) {
                        wx.setStorageSync('registered', true)
                        wx.navigateTo({
                            url: '../../auth/login/login',
                        })

                    } else if (res.code == 500) {
                        if (util.contains(res.message, "该用户已经存在")) {
                            wx.navigateTo({
                                url: '../../auth/login/login',
                            })
                        }
                        if (util.contains(res.message, "验证码错误")) {
                            wx.removeStorage({
                                key: 'mdAuthCode',
                            })
                            wx.removeStorage({
                                key: 'mdEmail',
                            })
                            wx.showToast({
                                title: '验证码失效，请重新注册',
                                icon: 'failed',
                                duration: 1000
                            })
                        }
                    }
                })
                //}
        }
        //}
});