// pages/user/love_history/love_history.js
var log = require('../../../util/log')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        genders: [
            { value: '女性', name: '女性', },
            { value: '男性', name: '女性', },
            { value: '未知', name: '未知', checked: 'true' },
        ],
        livings: [
            { value: '同居', name: '同居' },
            { value: '未同居', name: '未同居', checked: 'true' }
        ],
        startDate: "2019-10",
        endDate: "2020-10",
    },

    genderChange(e) {
        log.info('radio发生change事件，携带value值为：', e.detail.value)
        const items = this.data.genders
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false
            for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].value === values[j]) {
                    items[i].checked = true
                    break
                }
            }
        }
        this.setData({
            genders: items
        })
    },

    livingChange(e) {
        log.info('radio发生change事件，携带value值为：', e.detail.value)
        const items = this.data.livings
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false
            for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].value === values[j]) {
                    items[i].checked = true
                    break
                }
            }
        }
        this.setData({
            livings: items
        })
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

    }
})