// pages/message/edit/edit.js


Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: 0,
        uploadPicPaths: [],
        uploadPicIds: [],
        content: '',
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        getApp().launchPromise.then(() => {
            let that = this;
            util.checkLogin().then(function(res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                if (that.data.uid == '') {
                    that.data.uid = wx.getStorageSync('mdUserId')
                }
                //that.getUserProfile()
            }).catch(function(res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
    },

    onReady() {
        this.setData({
                width: (app.globalData.systemInfo.windowWidth) / 4 - 16
            })
            //this.getUserProfile()
    },

    getValue(e) {
        this.setData({
            content: e.detail.value
        })
    },

    getUserProfile(f) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                log.info(JSON.stringify(res))
                this.setData({
                    userInfo: res,
                    hasUserInfo: true
                })
                f()
            },
            fail: (res) => {

            }
        })
    },


    getUserInfo(e) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        this.setData({
            userInfo: e.detail,
            hasUserInfo: true
        })
    },

    insertImg(e) {
        let that = this;
        var arr = [],
            newArr = [],
            fileList = [];
        if (9 - that.data.uploadPicIds.length == 0) {
            return
        }
        wx.chooseImage({
            count: 9 - that.data.uploadPicIds.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                wx.showLoading({
                    title: '正在上传中',
                })
                const tempFilePaths = res.tempFilePaths
                for (let i = 0; i < tempFilePaths.length; i++) {
                    let uploadTask = wx.uploadFile({
                        url: api.UploadImageUrl,
                        header: {
                            "Content-Type": "multipart/form-data",
                            // 'Authorization': 'Bearer ' + app.globalData.token,
                        },
                        filePath: tempFilePaths[i],
                        name: 'file',
                        formData: null,
                        success(res) {
                            if (res.statusCode == 200) {
                                // log.info("upload image success " + res.data) //接口返回网络路径
                                var data = JSON.parse(res.data)
                                if (data.code == 200 &&
                                    data.data.imageUrls != undefined &&
                                    data.data.imageUrls != null &&
                                    data.data.imageUrls.length > 0) {
                                    var ids = []
                                    var tmp = that.data.uploadPicIds
                                    var tmpUrls = that.data.uploadPicPaths
                                    for (var j = 0; j < data.data.imageUrls.length; j++) {
                                        ids.push(data.data.imageUrls[j])
                                        tmp.push(data.data.imageUrls[j])
                                        tmpUrls.push(api.DownloadImageUrl + '?id=' + data.data.imageUrls[j])
                                    }
                                    that.setData({
                                            uploadPicIds: tmp,
                                            uploadPicPaths: tmpUrls
                                        })
                                        /*util.request(api.InsertContentUrl + "?id=" + that.data.id + "&picIds=" + ids,
                                    {},
                                    'POST'
                                ).then(function (res) {
                                    // log.info("BasicPicInsertUrl success + " + JSON.stringify(res))
                                })*/
                                }
                            }
                        }
                    })
                    uploadTask.onProgressUpdate((res) => {
                        wx.showLoading({
                            title: '正在上传',
                        })
                        if (res.progress == 100) {
                            log.info('上传进度', res.progress)
                            wx.hideLoading()
                        }
                    })
                }
            }
        })
    },
    //预览图片
    previewImg(e) {
        let url = e.currentTarget.dataset.imgurl;
        let that = this;
        log.info(url)
        wx.previewImage({
            current: url,
            urls: that.data.file,
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },

    //删除图片
    delImg(e) {
        log.info(e)
        let index = e.currentTarget.dataset.index;
        let that = this;
        this.data.uploadPicIds.splice(index, 1)
        this.data.uploadPicPaths.splice(index, 1)
        this.setData({
            uploadPicIds: that.data.uploadPicIds,
            uploadPicPaths: that.data.uploadPicPaths
        })
    },
    submitChange() {
        if (this.data.content == '') {
            util.showErrorToast('内容不能为空')
            return
        }
        wx.showLoading({
                title: '发送中...',
                mask: true
            })
            //app.request('/app/ShareImg', { img: JSON.stringify(this.data.fileList), content: this.data.content })

        this.getUserProfile(res => {
            log.info("log " + JSON.stringify(res))
            if (this.data.uid == null || this.data.uid == '') {
                this.setData({
                    uid: wx.getStorageSync('mdUserId')
                })
            }
            util.request(
                api.InsertUserWeiboUrl, {
                    wechatInfo: this.data.userInfo,
                    uid: this.data.uid,
                    picIds: this.data.uploadPicIds,
                    content: this.data.content,
                    userNickName: this.data.userInfo.userInfo.nickName,
                    userIcon: this.data.userInfo.userInfo.avatarUrl
                }, 'POST').then(res => {
                log.info("hello world " + JSON.stringify(res))
                if (res.code == 401) {
                    util.showErrorToast(res.mes)
                    return
                }
                wx.showLoading({
                    title: '发布成功',
                    mask: true
                })
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                    updates: true
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, 400)
            }).catch(res => {
                log.info("reject " + JSON.stringify(res))
                setTimeout(() => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }, 3000)
            })
        })
    }
})