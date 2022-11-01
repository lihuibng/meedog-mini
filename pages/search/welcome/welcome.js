// pages/search/welcome/welcome.js
//https://blog.csdn.net/wangxudongx/article/details/87275232
var log = require('../../../util/log.js') // 引用上面的log.js文件
Page({

    /**
     * 页面的初始数据
     */
    data: {

        missionHtml: '<div class="div_class" style="line-height: 20px; color: #1AAD19;">Keep <i><b> Real</b></i></div><div style="line-height: 20px; color: #1AAD19;"> <i><b>Peace</b></i> & <i><b>Love</b></i></div>',
        welcomeHtml: '<div class="div_class" style="line-height: 60px; color: #1AAD19;">欢迎体验<i><b>米小狗</b></i></div>',
    },

    JumpTo() {
        // 保留原始页面
        wx.switchTab({
                url: '../../search/index/index',
            })
            //点击出现支持扫描的二维码
            // wx.scanCode({

        // })
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
        return {
            title: '恋爱交友，来米小狗',
            path: '../../search/welcome/welcome'
        }
    }
})