// pages/user/education_list/education_list.js
var util = require('../../../util/util.js');
var api = require('../../../config/api.js');
var log = require('../../../util/log')
const app = getApp()

Page({
    data: {
        degreeItems: [
            '没读过书',
            '小学',
            '初中',
            '中专',
            '高中',
            '大专',
            '成人本科',
            '本科',
            '研究生',
            '在职研究生',
            'MBA',
            '博士',
            '博士后',
            '其他'
        ],
        uid: "",
        mdToken: "",
        degreeList: [],
        eduExprList: [],
        showTips: 0,
        addMoreDegree: false,
        years: 1,
        months: 1,
        days: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function(options) {
        getApp().launchPromise.then(() => {
            let that = this;
            var degreeList = wx.getStorageSync('degree')
            var degreeItems = []
            util.request(api.GetDegreeUrl, {}, 'POST').then(function(res) {
                if (res.code == 200) {
                    if (res.data.degreeItems.length > 0) {
                        degreeList = res.data.degreeItems
                    }
                    for (var i in degreeList) {
                        degreeItems.push(degreeList[i]['key'])
                    }
                    that.setData({
                        degreeItems: degreeItems
                    })
                }
            })
            that.data.mdToken = app.globalData.mdToken;
            that.data.uid = app.globalData.uid;
            if (that.data.uid != "") {
                this.doEduExprList();
            } else {
                log.info("hello")
            }
        }).catch(function(res) {
            wx.navigateTo({
                url: '../../auth/login/login',
            })
            log.info("hello " + JSON.stringify(res))
        })
    },

    doEduExprList: function() {
        let that = this;
        util.request(api.EduListUrl + "?uid=" + that.data.uid, {}, 'POST')
            .then(function(res) {
                //log.info(JSON.stringify(res))
                if (res.code == 200) {
                    for (var i = 0; i < res.data.length; i++) {
                        var item = res.data[i]
                            // log.info(JSON.stringify(item))
                        item.start = util.formatTime(item.start, "yyyy-MM")
                        item.end = util.formatTime(item.end, "yyyy-MM")
                        that.data.degreeList.push(item.degree)
                        that.data.eduExprList.push(item)
                    }
                    that.setData({
                            eduExprList: that.data.eduExprList,
                            degreeList: that.data.degreeList
                        })
                        //that.onShow()
                        // log.info("wyg_" + JSON.stringify(that.data))

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
        let that = this;
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
        this.onShow()
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