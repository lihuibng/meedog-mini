// pages/map/map_index/map_index.js
var log = require('../../../util/log.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: "吉林大学(前卫校区南区)",
        address: "吉林省长春市朝阳区前进大街2699号",
        latitude: 43.8237,
        longitude: 125.27718349
    },

    onChangeAddress() {
        var _page = this;
        wx.chooseLocation({
            success: (res) => {
                log.info(JSON.stringify(res))
                _page.setData({
                    address: res.name
                });
            },
            fail: (err) => {
                log.info(err);
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})