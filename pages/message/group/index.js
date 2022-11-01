// pages/message/group/index.js
let app = getApp();
var util = require('../../../util/util')
var api = require('../../../config/api')
var log = require('../../../util/log.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: 0,
        show: true,
        list: [],
        current: null,
        query: {
            pageNum: 0,
            pageSize: 15
        },
        userInfo: {},
        hasMore: true,
        isAdmin: false,
        flag: true,
        updates: false, //是否刷新
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getApp().launchPromise.then(() => {
            let that = this;
            util.checkLogin().then(function (res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                if (that.data.uid == '') {
                    that.data.uid = wx.getStorageSync('mdUserId')
                }
                that.shareMessage()

            }).catch(function (res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            width: (app.globalData.systemInfo.windowWidth) / 3 - 6,
            show: wx.getStorageSync('mdToken') ? true : false,
        })
        //this.shareMessage()
    },
    // 预览图片
    previews(e) {
        let index = e.currentTarget.dataset.index,
            urls = e.currentTarget.dataset.pre;
        // log.info(index)
        wx.previewImage({
            current: index, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    // 查看详情
    toComment(e) {
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '../share/share?item=' + item.id, //encodeURI(JSON.stringify(item)),
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    log.info(data)
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', item)
            }
        })
    },
    shareHandle(e) {
        let share_id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let nums = Number(this.data.list[index].forwardCount);
        var that = this;
        util.request(api.GetWeiboShareUrl, { id: share_id }, 'GET').then(res => {
            log.info(res)
            this.setData({
                ['list[' + index + '].forwardCount']: res ? nums + 1 : nums - 1
            })
            wx.showToast({
                title: '分享成功',
                icon: "none"
            });
        }).catch(res => {
            this.toLogin()
        })
    },

    // 点赞
    likeHandle(e) {
        if (!this.data.flag) { return }
        this.data.flag = false
        let share_id = e.currentTarget.dataset.shareid;
        let index = e.currentTarget.dataset.index,
            nums = Number(this.data.list[index].likeCount);
        this.setData({
            current: index
        })
        util.request(api.GetWeiboLikeUrl, { id: share_id }, 'GET').then(res => {
            log.info("like: " + JSON.stringify(res))
            this.setData({
                flag: true,
                ['list[' + index + '].likeCount']: res ? nums + 1 : nums - 1
            })
        }).catch(() => {
            this.setData({
                show: false
            })
        })
        setTimeout(res => {
            this.setData({
                current: null,
                flag: true
            })
        }, 1000)
    },
    // 获取图文列表信息,及用户信息
    shareMessage() {
        wx.showLoading({
            title: '加载中',
        })
        let data = this.data.query,
            oldList = this.data.list;
        util.request(api.GetUserWeiboUrl, data, 'GET').then(res => {
            if (res.data.length == 0) {
                this.data.hasMore = false
            }
            else if (res.data.length < data.pageSize) {
                this.data.hasMore = false
            }
            else if (res.data.length == data.pageSize) {
                this.data.query.pageNum = data.pageNum + 1
                this.setData({
                    hasMore: true
                })
            }

            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].picIds != undefined && res.data[i].picIds != null) {
                    for (var j = 0; j < res.data[i].picIds.length; j++) {
                        res.data[i].picIds[j] = api.DownloadImageUrl + "?id=" + res.data[i].picIds[j]
                    }
                }
                res.data[i].createTime = util.formatTime(res.data[i].createTime, "yyyy-MM-dd hh:mm")
                res.data[i].modifiedTime = util.formatTime(res.data[i].modifiedTime, "yyyy-MM-dd hh:mm")

            }

            //log.info
            //console.log("res.data2: " + JSON.stringify(res))
            this.setData({
                list: oldList.concat(res.data)
            })
            //log.info("res.data2: " + JSON.stringify(this.data))
            wx.hideLoading()

        }).catch(res => {
            //console.log("failed: " + JSON.stringify(res))
            this.setData({
                show: false
            })
            wx.hideLoading()
        })
    },

    toEdit() {
        wx.navigateTo({
            url: '../edit/edit',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //log.info(util.get('token'))
        wx.showLoading({
            title: '加载中'
        })
        if (this.data.updates) {
            this.data.list = []
            this.data.query.pageNum = 0
            this.shareMessage()
        }

        setTimeout(res => {
            wx.hideLoading()
        }, 400)
    },
    //获取token
    getUserInfo: function (e) {
        let info = e.detail.userInfo
        if (info) {
            wx.login({
                success: o => {
                    util.request(api.GetTokenUrl, { code: o.code, name: info.nickName, avatar: info.avatarUrl }).then(res => {
                        log.info(res)
                        app.globalData.mdToken = res.mdToken
                        if (res.uid == 1) {
                            this.setData({
                                isAdmin: true
                            })
                        }
                        //util.set('token', res.token, 7200)
                        app.globalData.isLogin = true
                        this.shareMessage()
                    })
                }
            })
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                show: true
            })
        }
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
        this.data.pageNum = 0
        this.data.list = []
        this.shareMessage(() => {
            wx.stopPullDownRefresh()
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.hasMore) {
            this.shareMessage()
        } else {
            util.showErrorToast('呜呜，已经到底啦！')
        }
    },

    onShareTimeline() {
        return {
            title: '分享了一个小程序'
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        log.info('onShareAppMessage: ' + JSON.stringify(this.data))
        var that = this
        var index = 0

        var nums = this.data.list[index].forwardCount == null ? 0 : Number(this.data.list[index].forwardCount);

        util.request(api.GetWeiboShareUrl, { id: this.data.list[index].id }, 'GET')
            .then(res => {
                this.setData({
                    ['list[' + index + '].forwardCount']: nums + 1
                })
                wx.showToast({
                    title: '分享成功',
                    icon: "none"
                });
            }).catch(() => {
                this.setData({
                    show: false
                })
            })

        return {
            title: app.globalData.userInfo.nickName + "分享给你一个对象",
            path: '../../../pages/message/share/share?item=' + this.data.list[index].id,
            imageUrl: '',
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                })
            }
        }
    }
})