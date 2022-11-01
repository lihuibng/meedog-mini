// pages/user/music/music.js
const app = getApp();
var util = require('../../../util/util.js');
var api = require('../../../config/api.js');
var log = require('../../../util/log')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        musicList: [{
                poster: 'https://p2.music.126.net/Wk-dQdmlSXI6WeNb8uo0yw==/109951164794238855.jpg',
                name: '此时此刻',
                author: '许巍',
                src: 'https://m10.music.126.net/20210102160752/f0cbb5b7acac083d7627ccbef7421c4e/ymusic/ts/free/e7328a8f3e0ee849b82781e229407b74.mp3',
                desc: "不要等到失去以后才知道珍惜",
            },
            {
                poster: 'https://p2.music.126.net/Wk-dQdmlSXI6WeNb8uo0yw==/109951164794238855.jpg',
                name: '此时此刻',
                author: '许巍',
                src: 'https://m10.music.126.net/20210102160752/f0cbb5b7acac083d7627ccbef7421c4e/ymusic/ts/free/e7328a8f3e0ee849b82781e229407b74.mp3',
                desc: "不要等到失去以后才知道珍惜",
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        getApp().launchPromise.then(() => {
            let that = this;
            that.data.mdToken = app.globalData.mdToken;
            that.data.uid = app.globalData.uid;
            if (that.data.uid != "") {
                this.doMusicList();
            } else {
                log.info("hello")
            }
        })
    },

    doMusicList: function() {
        let that = this;
        util.request(api.apiM + "?uid=" + that.data.uid, {}, 'POST')
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
                } else {
                    //log.info(JSON.stringify(res))
                }
            });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.audioCtx = wx.createAudioContext('myAudio')
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
    audioPlay: function() {
        this.audioCtx.play()
    },
    audioPause: function() {
        this.audioCtx.pause()
    },
    audio14: function() {
        this.audioCtx.seek(14)
    },
    audioStart: function() {
        this.audioCtx.seek(0)
    }
})