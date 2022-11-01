// pages/activity/map/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 导航路线
        markers: [{
            longitude: 114.072329,
            latitude: 22.725849,
        }, {
            id: 0,
            longitude: 114.277769,
            latitude: 22.730863,
        }],

        polyline: [{
            points: [{
                longitude: 114.072329,
                latitude: 22.725849
            }, {
                longitude: 114.277769,
                latitude: 22.730863
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        // 传递过来的经纬度是字符串，需要转成数值
        var latitude = Number(options.latitude);
        var longitude = Number(options.longitude);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 10
        })
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