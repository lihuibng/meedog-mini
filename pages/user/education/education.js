// pages/user/education/education.js
const api = require("../../../config/api");
const util = require("../../../util/util");
var log = require('../../../util/log')
const app = getApp()

Page({
    data: {
        showTopTips: false,
        degrees: [],
        degreeIndex: 7,
        countryItems: [],
        countryIndex: 2,
        regionItems: [],
        regionIndex: 0,
        regionMap: {},
        startDate: "",
        endDate: "",
        uid: "",
        mdToken: "",
        uploaded: false,
        graduatedStatus: [
            '未获',
            '获取',
            '其他'
        ],
        degreeGrantStatus: [
            '未获',
            '获取',
            '其他'
        ],
        isGraduated: 0,
        isDegreeGranted: 0,
        univerisity: "",
        language: "",
        dormitory: "",
        canteen: "",
        academicBuilding: "",
        teacher: "",
        major: "",
        livingFeeling: "",
        achievement: "",
        loveExperience: "",
        formData: {

        },
        uploadPicIds: [],
        uploadPicPaths: [], //网络路径

        images: [],
        image_descs: [],
        image_tags: [],
        imageWitdh: 0,
        x: 0, // movable-view的坐标
        y: 0,
        areaHeight: 0, // movable-area的高度
        hidden: true, // movable-view是否隐藏
        currentImg: '', // movable-view的图片地址
        currentIndex: 0, // 要改变顺序的图片的下标
        pointsArr: [], // 每张图片的坐标
        flag: true, // 是否是长按
        scrollTop: 0, // 滚动条距离顶部的距离
    },

    upImgs: function(imgurl, index) {
        var that = this;
        var filename = "image"
        if (imgurl.indexOf('/') != -1 && imgurl.indexOf('.') != -1) {
            filename = imgurl.split('/').slice(-1)
        }
        // log.info("upImage " + imgurl + " " + index + " " + filename)
        wx.uploadFile({
            url: api.UploadImageUrl, //'http://XXXXXX:9085/image/upload',//
            filePath: imgurl,
            name: 'file',
            header: {
                'enctype': 'multipart/form-data',
                'X-Meedog-Token': wx.getStorageSync('mdToken'),
                'Authorization': wx.getStorageSync('Authorization')
            },
            formData: null,
            success: function(res) {
                // log.info('upload image success,  ' + JSON.stringify(res))
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
                            tmpUrls.push(api.DownloadImageUrl + '&id=' + data.data.imageUrls[j])
                        }
                        that.setData({
                            uploadPicIds: tmp,
                            uploadPicPaths: tmpUrls
                        })
                        log.info("wyg:  " + JSON.stringify(that.data.uploadPicIds))
                        log.info("wyg:  " + JSON.stringify(that.data.uploadPicPaths))
                            /*util.request(api.EduPicInsertUrl + "?id=" + that.data.uid + "&picIds=" + ids,
                                {},
                                'POST'
                            ).then(function (res) {
                                log.info("BasicPicInsertUrl success + " + JSON.stringify(res))
                            })*/
                    } else {
                        log.info("BasicPicInsertUrl failed: " + JSON.stringify(res))
                    }
                    //log.info('wwww ' + JSON.stringify(that.data))
                } else if (res.statusCode == 401) {
                    // log.info("401: " + JSON.stringify(res))
                    wx.showToast({
                            title: '暂未登录或token已经过期'
                        })
                        // wx.removeStorageSync('Authorization')
                        // wx.removeStorageSync('mdToken')
                        // wx.navigateTo({
                        //    url: '../../auth/login/login',
                        //})

                } else {
                    // log.info("else: " + JSON.stringify(res))
                    wx.showToast({
                            title: '暂未登录或token已经过期'
                        })
                        //wx.removeStorageSync('Authorization')
                        //wx.removeStorageSync('mdToken')
                        //wx.navigateTo({
                        //    url: '../../auth/login/login',
                        //})
                }
            },

        })
    },

    //下载
    getImgs: function(id, tmpImg) {
        var that = this;
        // log.info("wygaaa+++" + id)
        wx.downloadFile({
            url: api.DownloadImageUrl + 'id=' + id,
            header: {
                'enctype': 'multipart/form-data',
                'X-Meedog-Token': wx.getStorageSync('mdToken'),
                'Authorization': wx.getStorageSync('Authorization'),
            },
            success: function(res) {
                // log.info("wyg+++" + JSON.stringify(res)) //接口返回网络路径
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    },

    // 计算图片宽度
    _handleComputedImage: function(e) {
        const windowWidth = app.globalData.systemInfo.windowWidth;
        const width = windowWidth - 16;
        const imageWitdh = (width - 16) / 3;
        this.setData({
            imageWitdh
        })
    },

    // 选择图片
    handleChooseImage: function(e) {
        let length = this.data.images.length;
        if (length == 9) {
            wx.showToast({
                title: "亲，最多只能选择九张图哦~",
                icon: "none",
                duration: 2000
            })
            return false;
        }
        var that = this;
        wx.chooseImage({
            count: 9 - this.data.images.length,
            sizeType: ['compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                let images = that.data.images;
                for (let i = 0; i < res.tempFilePaths.length; i++) {
                    images.push(res.tempFilePaths[i]);
                }
                that.setData({
                    images
                }, function() {
                    //上传完之后更新面积
                    that._handleComputedArea();
                });

            },
            fail: err => log.info(err)
        })
    },

    // 预览图片
    handlePreview: function(e) {
        let index = e.target.dataset.index;
        let images = this.data.images;
        wx.previewImage({
            current: images[index], //当前预览的图片
            urls: images, //所有要预览的图片数组
        })
    },

    // 删除图片
    handleDelete: function(e) {
        let index = e.target.dataset.index;
        let images = this.data.images;
        images.splice(index, 1);
        this.setData({
            images
        }, function() {
            this._handleComputedArea();
        });
    },

    // 计算movable-area的高度
    _handleComputedArea: function(e) {
        let that = this;
        wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function(rect) {
            that.setData({
                areaHeight: rect[0].height
            })
        }).exec()
    },

    // 计算每张图片的坐标
    _handleComputedPoints(e) {
        let that = this;
        var query = wx.createSelectorQuery();
        var nodesRef = query.selectAll(".image-item");
        nodesRef.fields({
            dataset: true,
            rect: true
        }, (result) => {
            that.setData({
                pointsArr: result
            })
        }).exec()
    },

    // 长按图片
    handleLongTap: function(e) {
        // 计算每张图片的坐标
        this._handleComputedPoints();
        this.setData({
            currentImg: e.currentTarget.dataset.url,
            currentIndex: e.currentTarget.dataset.index,
            hidden: false,
            flag: true,
            x: e.currentTarget.offsetLeft,
            y: e.currentTarget.offsetTop
        })
    },

    // 移动的过程中
    handleTouchMove: function(e) {
        let x = e.touches[0].pageX;
        let y = e.touches[0].pageY;
        // 首先先获得当前image-choose-container距离顶部的距离
        let that = this;
        wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function(rect) {
            let top = rect[0].top;
            y = y - that.data.scrollTop - top;
            that.setData({
                // x: x - that.data.imageWitdh / 2 > 0 ? x - that.data.imageWitdh / 2:0,
                // y: y - that.data.imageWitdh / 2 > 0 ? y - that.data.imageWitdh / 2:0,
                x: x,
                y: y,
            })

        }).exec()
    },

    // 移动结束的时候
    handleTouchEnd: function(e) {
        if (!this.data.flag) {
            // 非长按情况下
            return;
        }
        let x = e.changedTouches[0].pageX;
        let y = e.changedTouches[0].pageY - this.data.scrollTop;
        const pointsArr = this.data.pointsArr;
        let data = this.data.images;
        for (var j = 0; j < pointsArr.length; j++) {
            const item = pointsArr[j];
            if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
                const endIndex = item.dataset.index;
                const beginIndex = this.data.currentIndex;
                //临时保存移动的目标数据
                let temp = data[beginIndex];
                //将移动目标的下标值替换为被移动目标的下标值
                data[beginIndex] = data[endIndex];
                //将被移动目标的下标值替换为beginIndex
                data[endIndex] = temp;
            }
        }
        this.setData({
            images: data,
            hidden: true,
            flag: false,
            currentImg: ''
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // 计算图片
        this._handleComputedImage();
    },

    // 监听滚动
    onPageScroll: function(e) {
        this.data.scrollTop = e.scrollTop;
    },

    onLoad: function(options) {
        getApp().launchPromise.then(() => {
            let that = this;
            that.onRegion()
            that.onDegree()
            util.checkLogin().then(function(res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;

            }).catch(function(res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
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


    onRegion: function(e) {
        let that = this
        var regionMap = wx.getStorageSync('region')
        var countryItems = []
        var regionItems = []

        util.request(api.GetRegionUrl, {}, 'POST').then(function(res) {
            if (res.code == 200) {
                //log.info("res wyg: " + JSON.stringify(res))
                if (res.data.regionItems.length > 0) {
                    for (var i = 0; i < res.data.regionItems.length; i++) {
                        countryItems.push(res.data.regionItems[i].name)
                    }
                    for (var i = 0; i < res.data.regionItems[2].children.length; i++) {
                        regionItems.push(res.data.regionItems[2].children[i].name)
                    }
                    that.setData({
                        countryItems: Array.from(new Set(countryItems)),
                        countryIndex: 2,
                        regionItems: Array.from(new Set(regionItems)),
                        regionIndex: 0,
                        regionMap: regionMap
                    })
                    wx.setStorageSync('region', res.data.regionItems)
                }
            }
        }).catch(function(res) {})
    },

    onDegree: function(e) {
        let that = this
        var degreeList = wx.getStorageSync('degree')
        if (degreeList.length > 0) {
            var tmp = []
            for (var i = 0; i < degreeList.length; i++) {
                tmp.push(degreeList[i].name)
            }
            that.setData({
                degrees: tmp
            })
        } else {
            util.request(api.GetDegreeUrl, {}, 'POST').then(function(res) {
                log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    var tmp = []
                    for (var i = 0; i < res.data.degreeItems.length; i++) {
                        tmp.push(res.data.degreeItems[i].name)
                    }
                    that.setData({
                        degrees: tmp
                    })
                    log.info(JSON.stringify(that.data.degrees))
                    wx.setStorageSync('degree', res.data.degreeItems)
                }
            }).catch(function(res) {
                log.info(JSON.stringify(res))
            })
        }
    },

    bindDegreeGrantStatusChange: function(e) {
        this.setData({
            isDegreeGranted: e.detail.value,
            [`formData.isDegreeGranted`]: e.detail.value
        })
    },

    bindGraduatedStatusChange: function(e) {
        this.setData({
            isGraduated: e.detail.value,
            [`formData.isGraduated`]: e.detail.value
        })
    },
    bindStartDateChange: function(e) {
        this.setData({
            startDate: e.detail.value,
            [`formData.startDate`]: e.detail.value
        })
    },

    bindEndDateChange: function(e) {
        this.setData({
            endDate: e.detail.value,
            [`formData.endDate`]: e.detail.value
        })
    },

    bindInputUniversity: function(e) {
        this.setData({
            univerisity: e.detail.value,
            [`formData.unversity`]: e.detail.value
        })
    },

    bindInputCountry: function(e) {
        var regionItems = []
        for (var i = 0; i < this.data.regionMap[e.detail.value].children.length; i++) {
            regionItems.push(this.data.regionMap[e.detail.value].children[i].name)
        }
        this.setData({
            countryIndex: e.detail.value,
            [`formData.countryIndex`]: e.detail.value,
            regionItems: Array.from(new Set(regionItems)),
            regionIndex: 0,
            [`formData.regionIndex`]: 0
        })
    },

    bindInputRegion: function(e) {
        this.setData({
            regionIndex: e.detail.value,
            [`formData.regionIndex`]: e.detail.value
        })
    },

    bindInputDormitory: function(e) {
        this.setData({
            dormitory: e.detail.value,
            [`formData.dormitory`]: e.detail.value
        })
    },

    bindInputCanteen: function(e) {
        this.setData({
            canteen: e.detail.value,
            [`formData.canteen`]: e.detail.value
        })
    },

    bindInputAcademicBuilding: function(e) {
        this.setData({
            academicBuilding: e.detail.value,
            [`formData.academicBuilding`]: e.detail.value
        })
    },

    bindInputTeacher: function(e) {
        this.setData({
            teacher: e.detail.value,
            [`formData.teacher`]: e.detail.value
        })
    },

    bindMajorChange: function(e) {
        this.setData({
            major: e.detail.value
        })
    },

    bindDegreeChange: function(e) {
        this.setData({
            degreeIndex: e.detail.value,
        });
    },

    onLivingFeelingInput: function(e) {
        this.setData({
            livingFeeling: e.detail.value,
        });
    },

    onAchievementInput: function(e) {
        this.setData({
            achievement: e.detail.value,
        });
    },

    onLoveExperienceInput: function(e) {
        this.setData({
            loveExperience: e.detail.value,
        });
    },

    onPicUploaded: function(e) {
        let that = this;
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < that.data.images.length; i++) {
                that.upImgs(that.data.images[i], i) //调用上传方法
            }
            resolve(that.data);
        }).then((res) => { /*log.info(res)*/ })
    },

    onEduExprInsert: function(e) {
        let that = this
        var picId = 0;
        if (that.data.uploadPicIds.length > 0) {
            picId = that.data.uploadPicIds[0]
        }
        util.request(api.EduInsertUrl, {
                uid: that.data.uid,
                degree: that.data.degreeIndex,
                abroad: that.data.countryIndex,
                isDegreeGranted: that.data.isDegreeGranted,
                isGraduated: that.data.isGraduated,
                start: that.data.startDate,
                end: that.data.endDate,
                picId: picId,
                picIds: that.data.uploadPicIds,
                school: that.data.univerisity,
                country: that.data.countryItems[that.data.countryIndex],
                city: that.data.regionItems[that.data.regionIndex],
                language: that.data.language,
                dormitory: that.data.dormitory,
                canteen: that.data.canteen,
                academicBuilding: that.data.academicBuilding,
                teacher: that.data.teacher,
                major: that.data.major,
                livingFeeling: that.data.livingFeeling,
                achievement: that.data.achievement,
                loveExperience: that.data.loveExperience
            },
            'POST'
        ).then(function(res) {
            log.info("ssss " + JSON.stringify(res))
            if (res.code == 401) {
                wx.showToast({
                    title: '暂未登录或token已经过期'
                })
            }
            if (res.code == 200) {
                wx.showToast({
                    title: '添加成功'
                })
            }
        })
    },
    submitForm() {
        let that = this;
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                for (var i = 0; i < that.data.images.length; i++) {
                    that.upImgs(that.data.images[i], i) //调用上传方法
                    setTimeout(() => {
                        this.onEduExprInsert()
                    }, 2000);
                }
                //setTimeout()
                log.info(JSON.stringify(res))
                log.info("this data: " + JSON.stringify(this.data))

            }
        })
    }
})