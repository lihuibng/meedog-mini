// pages/user/footprint/footprint.js
var log = require('../../../util/log')

const customCallout2 = {
    id: 3,
    latitude: 23.096994,
    longitude: 113.324520,
    iconPath: '../../../static/img/WechatIMG4.png',
    customCallout: {
        anchorY: 10,
        anchorX: 0,
        display: 'ALWAYS',
    },
}
const allMarkers = [customCallout2]
Page({

    /**
     * 页面的初始数据
     */

    data: {
        latitude: 23.096994,
        longitude: 113.324520,
        markers: [],
        customCalloutMarkerIds: [],
        num: 1
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

    onReady: function(e) {
        this.mapCtx = wx.createMapContext('myMap')
    },

    addMarker() {
        const markers = allMarkers
        this.setData({
            markers,
            customCalloutMarkerIds: [2, 3, 4],
        })
    },

    removeMarker() {
        this.setData({
            markers: [],
            customCalloutMarkerIds: []
        })
    },

    changeMarkerId() {
        const customCalloutMarkerIds = this.data.customCalloutMarkerIds.slice()
        const top = customCalloutMarkerIds.shift()
        customCalloutMarkerIds.push(top)

        this.setData({
            customCalloutMarkerIds
        })
    },

    markertap(e) {
        log.info('@@@ markertap', e)
    },

    callouttap(e) {
        log.info('@@@ callouttap', e)
    },

    labeltap(e) {
        log.info('@@@ labeltap', e)
    },

    translateMarker: function() {
        const length = this.data.markers.length
        if (length === 0) return
        const index = Math.floor(Math.random() * length)
        const markers = this.data.markers
        const marker = markers[index]
        marker.latitude = marker.latitude + 0.002
        marker.longitude = marker.longitude + 0.002
        const that = this
        this.mapCtx.translateMarker({
            markerId: marker.id,
            duration: 1000,
            destination: {
                latitude: marker.latitude,
                longitude: marker.longitude
            },
            animationEnd() {
                that.setData({ markers })
                log.info('animation end')
            },
            complete(res) {
                log.info('translateMarker', res)
            }
        })
    },
    changeContent() {
        const num = Math.floor(Math.random() * 10)
        this.setData({ num })
    }
})