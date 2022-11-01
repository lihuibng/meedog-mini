// pages/user/foods/foods.js
var log = require('../../../util/log')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: [], //本地图片地址数组
        picPaths: [], //网络路径
        src: "../../../static/img/cheers-black.png",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //添加上传图片
    chooseImageTap: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#00000",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage('camera')
                    }
                }
            }
        })
    },
    // 图片本地路径
    chooseWxImage: function(type) {
        var that = this;
        var imgsPaths = that.data.imgs;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function(res) {
                log.info(res.tempFilePaths[0]);
                that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
            }
        })
    },

    // 图片本地路径
    bindDownloadImage: function(type) {
        var that = this;
        that.getImgs("1348159457313423404", "");
    },

    //上传服务器
    upImgs: function(imgurl, index) {
        var that = this;
        wx.uploadFile({
            url: 'http://XXXXXX:9085/image/upload', //
            filePath: imgurl,
            name: 'file',
            header: {
                'enctype': 'multipart/form-data',
                'X-Meedog-Token': wx.getStorageSync('mdToken'),
                'Authorization': wx.getStorageSync('Authorization')
            },
            formData: null,
            success: function(res) {
                log.info(res) //接口返回网络路径
                var data = JSON.parse(res.data)
                that.data.picPaths.push(data['msg'])
                that.setData({
                    picPaths: that.data.picPaths
                })
                log.info(that.data.picPaths)
            }
        })
    },

    //上传服务器
    getImgs: function(id, tmpImg) {
        var that = this;
        log.info("wygaaa+++" + id)
        wx.downloadFile({
            url: 'http://XXXXXX:9085/image/get/?id=' + id,
            header: {
                'enctype': 'multipart/form-data',
                'X-Meedog-Token': wx.getStorageSync('mdToken'),
                'Authorization': wx.getStorageSync('Authorization'),
            },
            success: function(res) {
                log.info("wyg+++")
                log.info(res) //接口返回网络路径
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})