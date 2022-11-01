// pages/user/index/index.js
var util = require('../../../util/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var log = require('../../../util/log')
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mdUserId: {},
        hasMobile: '',
        fUser: {},
        commission: {
            allProfit: 0,
            getProfit: 0
        },
        isshow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    onShow: function() {
        this.setData({
            isshow: true
        });
    },

    noLogin() {
        log.info('-----*noLogin*******---------', wx.getStorageSync('mdToken'))
        if (!wx.getStorageSync('mdToken')) {
            log.info("}}}}}}")
            wx.showToast({
                title: '请先登录～',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
    },

    onShareAppMessage: function() {
        this.noLogin();
        return {
            title: '邀请好友',
            path: 'pages/product/product?id=-1&userId=' + wx.getStorageSync('uId')
        }
    },

    bindGetmdUserId(e) {
        let mdToken = wx.getStorageSync('mdToken');
        if (mdToken) {
            return false;
        }
        if (e.detail.mdUserId) {
            user.loginByWeixin(e.detail).then(res => {
                let mdUserId = wx.getStorageSync('mdUserId');
                this.setData({
                    mdUserId: mdUserId.mdUserId,
                    isshow: true
                });
                app.globalData.mdUserId = mdUserId.mdUserId;
                app.globalData.mdToken = res.data.openid;
            }).catch((err) => {
                log.info(err)
            });
        } else {
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function(res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.mdUserId"]) {
                                    user.loginByWeixin(e.detail).then(res => {
                                        let mdUserId = wx.getStorageSync('mdUserId');
                                        this.setData({
                                            mdUserId: mdUserId.mdUserId,
                                            isshow: true
                                        });
                                        app.globalData.mdUserId = mdUserId.mdUserId;
                                        app.globalData.mdToken = res.data.openid;
                                    }).catch((err) => {
                                        log.info(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }
    },

    exitLogin: function() {
        let that = this
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function(res) {
                log.info("------:", res)
                if (res.confirm) {
                    wx.removeStorageSync('mdToken');
                    wx.removeStorageSync('mdUserId');
                    wx.clearStorage({
                        success: (res) => {
                            console.log("cleared: " + JSON.stringify(res))
                        },
                    })
                    app.globalData.mdUserId = {}
                    that.setData({
                        mdUserId: {},
                    });
                    wx.navigateTo({
                        url: '../../auth/login/login'
                    });
                }
            }

        })

    }
})