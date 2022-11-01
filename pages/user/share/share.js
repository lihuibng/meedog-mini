// pages/user/share/share.js
var util = require('../../../util/util.js');
var api = require('../../../config/api.js');
var log = require('../../../util/log')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mdToken: "",
        uid: "",
        invitations: [],
        email: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().launchPromise.then(() => {
            let that = this;
            that.data.mdToken = app.globalData.mdToken;
            that.data.uid = app.globalData.uid;
            if (that.data.uid != "") {
                this.GetInvitations(that.data.uid);
            } else {
                log.info("hello")
            }
        })
    },

    GetInvitations: function(uid) {
        let that = this;
        util.request(api.GetInvitationsUrl + "?uid=" + uid, {}, 'GET')
            .then(function(res) {
                if (res.code == 200) {
                    for (var i = 0; i < res.data.length; i++) {
                        var item = res.data[i]
                        that.data.invitations.push(item)
                    }
                    that.setData({
                        invitations: that.data.invitations
                    })
                    log.info(JSON.stringify(that.data))
                } else {
                    //log.info(JSON.stringify(res))
                }
            });
    },

    submit: function() {
        wx.navigateTo({
            url: '../../pages/auth/invite/invite',
        })
    },

    DoInvite: function(uid, email) {
        util.request(api.GetInvitationCodeUrl + "?uid=" + uid + "&email=" + email, {}, 'POST')
            .then(function(res) {
                //log.info(JSON.stringify(res))
                if (res.code == 200) {
                    for (var i = 0; i < res.data.length; i++) {
                        var item = res.data[i]
                        that.data.invitations.push(item)
                    }
                    that.setData({
                        invitations: that.data.invitations
                    })
                } else {
                    //log.info(JSON.stringify(res))
                }
            });
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

    }
})