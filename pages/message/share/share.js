// pages/message/share/share.js
// pages/shareDetail/index.js
var app = getApp();
var util = require('../../../util/util.js')
var api = require('../../../config/api')
var log = require('../../../util/log.js')

Page({
    data: {
        detail: {},
        uid: '',
        img: [],
        width: 0,
        flag: true,
        list: [],
        query: {
            pageNum: 0,
            pageSize: 8,
            id: '',
            cid: 0,
        },
        userInfo: {},
        content: '',
        hasMore: true
    },
    onLoad: function (options) {
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        //eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
        //eventChannel.emit('someEvent', {data: 'test'});
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (res) {
            let os = res
            // let os = JSON.parse(decodeURI(o.item));
            log.info(JSON.stringify(os))
            that.setData({
                detail: os,
                img: os.picIds,
                width: (app.globalData.systemInfo.windowWidth) / 3 - 6,
            })
            that.data.query.id = os.id;
            that.getCommentList()
            log.info(that.data.list)
            that.setData({
                detail: os,
                img: os.picIds,
                width: (app.globalData.systemInfo.windowWidth) / 3 - 6,
            })
            //that.data.query.id = os.id;
            //that.getCommentList()
            //log.info(this.data.list)
        })
        getApp().launchPromise.then(() => {
            let that = this;
            util.checkLogin().then(function (res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                if (that.data.uid == '') {
                    that.data.uid = wx.getStorageSync('mdUserId')
                }
                //that.shareMessage()

            }).catch(function (res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
    },
    getUserProfile(f) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                log.info("user profile: " + JSON.stringify(res))
                this.setData({
                    userInfo: res,
                    hasUserInfo: true
                })
                f()
            },
            fail: (res) => {
                log.info("user profile fail: " + JSON.stringify(res))
            }
        })
    },
    previews(e) {
        let index = e.currentTarget.dataset.index, urls = e.currentTarget.dataset.pre;
        wx.previewImage({
            current: index, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },

    toComment() {
        this.setData({
            flag: !this.data.flag
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.pop = this.selectComponent('#pop')
        //this.getUserProfile()
    },

    showModel() {
        this.setData({
            content: ''
        })
        this.pop.toggleModel()
    },

    getValue(e) {
        log.info(e)
        this.setData({
            content: e.detail.value
        })
    },

    addComment() {
        let content = this.data.content;
        if (!content) {
            util.showErrorToast('内容不能为空')
            return
        }
        wx.showLoading({
            title: '发送中',
            mask: true
        })
        if (this.data.uid == null || this.data.uid == '') {
            this.setData({
                uid: wx.getStorageSync('mdUserId')
            })
        }
        this.getUserProfile(res => {
            util.request(api.InsertCommentUrl, {
                content: content,
                weiboId: this.data.detail.id,
                uid: this.data.uid,
                commentId: 0,
                userNickName: this.data.userInfo.userInfo.nickName,
                userIcon: this.data.userInfo.userInfo.avatarUrl
            }, 'POST').then(res => {
                log.info(JSON.stringify(res))
                if (res.code == 401) {
                    util.showErrorToast(res.mes)
                    return
                }
                if (res) {
                    util.showErrorToast('评论成功')
                    this.showModel()
                    this.data.list = []
                    this.data.query.page = 1;
                    this.getCommentList()
                    wx.hideLoading({
                        success: (res) => { },
                    })
                }
            }).catch(res => {
                log.info('data: reject: ' + JSON.stringify(res))
                setTimeout(() => {
                    wx.hideLoading({
                        success: (res) => {
                            this.showModel()
                        },
                    })
                    //this.showModel()
                }, 2000)
            })
        })
    },
    hide() {
        this.setData({
            flag: !this.data.flag
        })
    },
    getCommentList() {
        let data = this.data.query, oldList = this.data.list, news = [];
        util.request(api.GetWeiboCommentUrl + '?id=' + data.id + '&cid=' + data.cid + '&pageNum' + data.pageNum + '&pageSize=' + data.pageSize, {}, 'GET').then(res => {
            log.info(res.data)
            news = res.data
            if (res.data.length == 0) {
                this.data.hasMore = false
            }
            else if (res.data.length < data.pageSize) {
                this.data.hasMore = false
            }
            else if (res.data.length == data.pageSize) {
                this.data.query.page = data.pageNum + 1
                this.setData({
                    hasMore: true
                })
            }
            for (var i = 0; i < news.length; i++) {
                news[i].createTime = util.formatTime(news[i].createTime, "yyyy-MM-dd hh:mm")
                news[i].modifiedTime = util.formatTime(news[i].modifiedTime, "yyyy-MM-dd hh:mm")
            }
            this.setData({
                list: oldList.concat(news)
            })
            log.info(res.data)
        }).catch(err => { })
    },

    toLogin() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            show: false
        })
        wx.navigateBack({
            delta: 1,
        })
    },

    commit() {
        let data = {
            share_id: this.data.detail.id,
            content: '测试'
        };
        //app.request('/app/comments', data).then(res => { })
        util.request(api.GetCommentsUrl, data, 'GET').then(res => {
            log.info(JSON.stringify(res))
        })
    },

    shareHandle(e) {
        let share_id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let nums = Number(this.data.detail.forwardCount);
        var that = this;
        util.request(api.GetWeiboShareUrl, { id: share_id }, 'GET').then(res => {
            log.info(res)
            this.setData({
                //['list[' + index + '].forwardCount']: res ? nums + 1 : nums - 1
                ['detail.forwardCount']: res ? nums + 1 : nums - 1
            })
            wx.showToast({
                title: '分享成功',
                icon: "none"
            });
        }).catch(res => {
            this.toLogin()
        })
    },

    likeHandle(e) {
        if (!this.data.flag) { return }
        this.data.flag = false
        let share_id = e.currentTarget.dataset.shareid,
            nums = Number(this.data.detail.likeCount);
        this.setData({
            current: true
        })

        util.request(api.GetWeiboLikeUrl, { id: share_id }, 'GET').then(res => {
            this.setData({
                flag: true,
                ['detail.likeCount']: res ? nums + 1 : nums - 1
            })
        }).catch(() => {
            this.toLogin()
        })
        setTimeout(res => {
            this.setData({
                current: null,
                flag: true
            })
        }, 1000)
    },
    onReachBottom: function () {
        if (this.data.hasMore) {
            this.getCommentList()
        } else {
            util.showSuccessToast('呜呜，已经到底啦！')
        }
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

    onShareTimeline() {
        return {
            title: '分享了一个精美头像',
            query: '../../../pages/message/group/index?item=' + this.data.detail,
            imageUrl: this.data.img[0]
        }
    },

    onShareAppMessage: function (e) {
        log.info('onShareAppMessage: ' + JSON.stringify(this.data))
        var that = this
        var index = 0
        
        var nums = this.data.detail.forwardCount == null ? 0 : Number(this.data.detail.forwardCount);

        util.request(api.GetWeiboShareUrl, {id:this.data.detail.id}, 'GET')
            .then(res => {
                this.setData({
                    ['detail.forwardCount']: nums + 1
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
            path: '../../../pages/message/share/share?item=' + this.data.detail.id,
            imageUrl: '',
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                })
            }
        }
    }

    /**
     * 用户点击右上角分享
     */
    /*
    onShareAppMessage: function (e) {
        let share_id = e.target.dataset.id, index = e.target.dataset.index, item = e.target.dataset.item;
        var that = this, nums = this.data.detail.share == null ? 0 : Number(this.data.detail.share.count);
        //app.request('/app/shareCount', { share_id })
        util.request(api.ShareCountUrl, { share_id: share_id }, 'POST').then(res => {
            log.info(res)
            wx.showToast({
                title: '分享成功',
                icon: "none"
            });
            this.setData({
                ['detail.forwardCount']: nums + 1
            })
        }).catch(res => {
            this.toLogin()
        })
        return {
            title: this.data.userInfo.userInfo + "分享给你一张图片",
            path: '../../../pages/share/share?item=' + JSON.stringify(item),
            imageUrl: '',
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                })
            }
        }
    }*/
})