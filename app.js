/*
  {
                "pagePath": "pages/activity/activity/index",
                "iconPath": "static/img/cheers-black.png",
                "selectedIconPath": "static/img/cheers-whitepink.png",
                "text": "面基"
            }, 
*/
App({
    onLaunch: function (options) {
        this.globalData.uid = wx.getStorageSync('mdUserId')
        this.globalData.mdToken = wx.getStorageSync('mdToken')
        this.globalData.mdEmail = wx.getStorageSync('mdEmail')
        this.globalData.Authorization = wx.getStorageSync('Authorization')
        this.globalData.mdAuthCode = wx.getStorageSync('mdAuthCode')
        this.getSystemInfo()
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        this.launchPromise = new Promise((resolve, reject) => {
            setTimeout(resolve, 15000)
        })
    },

    // 获得设备信息
    getSystemInfo: function () {
        let t = this;
        wx.getSystemInfo({
            success: function (res) {
                t.globalData.systemInfo = res
            },
            fail: function (err) {
                console.log(err)
            }
        });
    },


    globalData: {
        systemInfo: null,
        userInfo: null,
        uid: '',
        mdToken: '',
        mdEmail: '',
        mdAuthCode: '',
        Authorization: '',
        isLogin: ''
    }
})