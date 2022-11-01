// pages/user/basic_info/basic_info.js
const util = require("../../../util/util");
const api = require("../../../config/api");
var log = require('../../../util/log.js') // 引用上面的log.js文件
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showTopTips: false,
        modify: false,
        id: "",
        uid: "",
        mdToken: "",
        genders: ['男', '女', '未知'],
        genderIndex: 0,
        marriages: ["单身", "恋爱", "订婚", "结婚", "离异"],
        marriageIndex: 0,
        provinces: [],
        citys: [],
        registeredArray: [
            ['北京市'],
            ['北京市']
        ],
        registeredIndex: [0, 0],
        registeredProvince: '',
        registeredCity: '',

        residenceArray: [
            ['北京市'],
            ['北京市']
        ],
        residenceIndex: [0, 0],
        residenceProvince: '',
        residenceCity: '',

        zodiacs: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
        zodiacIndex: 0,
        constellations: ["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎", "射手", "摩羯", "水瓶", "双鱼"],
        constellationIndex: 0,
        sexualItems: ["异性恋", "同性恋", "双性恋", "不恋"],
        sexualIndex: 0,
        sexualDesc: "",
        height: 0,
        weight: 0,
        facialAttractiveness: 0,
        nation: "",
        industry: "",
        jobType: "",
        jobProof: "",
        jobQuestion: "",
        formData: {

        },
        uploadPicIds: [],
        uploadPicPaths: [], //网络路径
        PicPaths: [],
        downPicIds: [],
        downPicPaths: [],
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        src: "",

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
        // log.info("handlePreview " + JSON.stringify(e))
        let index = e.target.dataset.index;
        let images = this.data.images;
        wx.previewImage({
            current: images[index], //当前预览的图片
            urls: images, //所有要预览的图片数组
        })
    },
    bindSwiper: function(e) {
        const url = e.currentTarget.dataset.url
        if (url) {
            wx.navigateTo({
                url
            })
        }
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
        this.OnBasicInfo()
    },

    // 监听滚动
    onPageScroll: function(e) {
        this.data.scrollTop = e.scrollTop;
    },
    /*
    chooseImageTap: function () {
        let that = this
        for (var i = 0; i < that.data.images.length; i++) {
            that.upImgs(that.data.images[i], i) //调用上传方法
        }
    },
    preview(e) {
        log.info("preview " + e.currentTarget.dataset.src)
        let currentUrl = e.currentTarget.dataset.src
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: this.data.uploadPicPaths // 需要预览的图片http链接列表
        })
    },
    //添加上传图片
    chooseImageTap: function () {
        var that = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#00000",
            success: function (res) {
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
    chooseWxImage: function (type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
                log.info("chooswWxImage: " + res.tempFilePaths[0]);
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    that.upImgs(res.tempFilePaths[i], i) //调用上传方法
                }
            }
        })
    },

    // 图片本地路径
    bindDownloadImage: function (type) {
        var that = this;
        that.getImgs("1348159457313423404", "");
    },
*/
    //上传服务器
    upImgs: function(imgurl, index) {
        var that = this;
        var filename = "image"
        if (imgurl.indexOf('/') != -1 && imgurl.indexOf('.') != -1) {
            filename = imgurl.split('/').slice(-1)
        }
        // log.info("upImage " + imgurl + " " + index + " " + filename)
        console.log('upload image success,  ' + imgurl)
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
                console.log('upload image success,  ' + JSON.stringify(res))
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
                        util.request(api.BasicPicInsertUrl + "?id=" + that.data.id + "&picIds=" + ids, {},
                            'POST'
                        ).then(function(res) {
                            log.info("BasicPicInsertUrl success + " + JSON.stringify(res))
                        })
                    } else {
                        log.info("BasicPicInsertUrl failed: " + JSON.stringify(res))
                    }
                    log.info('wwww ' + JSON.stringify(that.data))
                } else if (res.statusCode == 401) {
                    og.info("401: " + JSON.stringify(res))
                    wx.showToast({
                            title: '暂未登录或token已经过期'
                        })
                        // wx.removeStorageSync('Authorization')
                        // wx.removeStorageSync('mdToken')
                        // wx.navigateTo({
                        //    url: '../../auth/login/login',
                        //})

                } else {
                    log.info("else: " + JSON.stringify(res))
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
            fail: function(res) {
                console.log('upload image faile,  ' + JSON.stringify(res))
            }
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        getApp().launchPromise.then(() => {
            let that = this;
            util.checkLogin().then(function(res) {
                that.data.mdToken = app.globalData.mdToken;
                that.data.uid = app.globalData.uid;
                that.onGender()
                that.onMarriage()
                that.onAllCity()
                that.onConstellation()
                that.onZodiac()
                that.onSexualType()
                that.OnBasicInfo()
            }).catch(function(res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
    },
    onGender: function(e) {
        let that = this
        var genderList = wx.getStorageSync('gender')
        if (genderList.length > 0) {
            var tmp = []
            for (var i = 0; i < genderList.length; i++) {
                tmp.push(genderList[i].name)
            }
            // log.info("genderList: " + JSON.stringify(tmp))
            that.setData({
                genders: tmp
            })
        } else {
            util.request(api.GetGenderUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    if (res.data.hasOwnProperty('genderItems')) {
                        var tmp = []
                        for (var i = 0; i < res.data.genderItems.length; i++) {
                            tmp.push(res.data.genderItems[i].name)
                        }
                        that.setData({
                                genders: tmp
                            })
                            // log.info("data genderList: " + JSON.stringify(that.data.genders))
                        wx.setStorageSync('gender', res.data.genderItems)
                    }

                }
            }).catch(function(res) {
                // log.info("genderList catch: " + JSON.stringify(res))
            })
        }
    },
    onZodiac: function(e) {
        let that = this
        var zodiacList = wx.getStorageSync('zodiac')
        if (zodiacList.length > 0) {
            var tmp = []
            for (var i = 0; i < zodiacList.length; i++) {
                tmp.push(zodiacList[i].name)
            }
            // log.info("console + " + JSON.stringify(tmp))
            that.setData({
                zodiacs: tmp
            })
        } else {
            util.request(api.GetZodiacUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    if (res.data.hasOwnProperty('zodiacItems')) {
                        var tmp = []
                        for (var i = 0; i < res.data.zodiacItems.length; i++) {
                            tmp.push(res.data.zodiacItems[i].name)
                        }
                        that.setData({
                                zodiacs: tmp
                            })
                            // log.info("zodiacs: " + JSON.stringify(that.data.zodiacs))
                        wx.setStorageSync('zodiac', res.data.zodiacItems)
                    }
                }
            }).catch(function(res) {
                // log.info("zodiacs catch: " + JSON.stringify(res))
            })
        }
    },
    onConstellation: function(e) {
        let that = this
        var constellationList = wx.getStorageSync('constellation')
        if (constellationList.length > 0) {
            var tmp = []
            for (var i = 0; i < constellationList.length; i++) {
                tmp.push(constellationList[i].name)
            }
            // log.info(JSON.stringify(tmp))
            that.setData({
                constellations: tmp
            })
        } else {
            util.request(api.GetConstellationUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    if (res.data.hasOwnProperty('constellationItems')) {
                        var tmp = []
                        for (var i = 0; i < res.data.constellationItems.length; i++) {
                            tmp.push(res.data.constellationItems[i].name)
                        }
                        that.setData({
                                constellations: tmp
                            })
                            // log.info(JSON.stringify(that.data.constellations))
                        wx.setStorageSync('constellation', res.data.constellationItems)
                    }
                }
            }).catch(function(res) {
                // log.info(JSON.stringify(res))
            })
        }
    },
    onMarriage: function(e) {
        let that = this
        var marriageList = wx.getStorageSync('marriage')
        if (marriageList.length > 0) {
            var tmp = []
            for (var i = 0; i < marriageList.length; i++) {
                tmp.push(marriageList[i].name)
            }
            // log.info(JSON.stringify(tmp))
            that.setData({
                marriages: tmp
            })
        } else {
            util.request(api.GetMarriageUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    if (res.data.hasOwnProperty('marriageStatusItems')) {
                        var tmp = []
                        for (var i = 0; i < res.data.marriageStatusItems.length; i++) {
                            tmp.push(res.data.marriageStatusItems[i].name)
                        }
                        // log.info(JSON.stringify(tmp))
                        that.setData({
                                marriages: tmp
                            })
                            // log.info(JSON.stringify(that.data.marriages))
                        wx.setStorageSync('marriage', res.data.marriageStatusItems)
                    }
                }
            }).catch(function(res) {
                // log.info(JSON.stringify(res))
            })
        }
    },
    onSexualType: function(e) {
        let that = this
        var sexualTypeList = wx.getStorageSync('sexual_type')
        if (sexualTypeList.length > 0) {
            var tmp = []
            for (var i = 0; i < sexualTypeList.length; i++) {
                tmp.push(sexualTypeList[i].name)
            }
            // log.info(JSON.stringify(tmp))
            that.setData({
                sexualItems: tmp
            })
        } else {
            util.request(api.GetSexualTypeUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    if (res.data.hasOwnProperty('sexualTypeItems')) {
                        var tmp = []
                        for (var i = 0; i < res.data.sexualTypeItems.length; i++) {
                            tmp.push(res.data.sexualTypeItems[i].name)
                        }
                        // log.info(JSON.stringify(tmp))
                        that.setData({
                                sexualItems: tmp
                            })
                            // log.info(JSON.stringify(that.data.sexualItems))
                        wx.setStorageSync('sexual_type', res.data.sexualTypeItems)
                    }
                }
            }).catch(function(res) {
                // log.info(JSON.stringify(res))
            })
        }
    },
    onAllCity: function(e) {
        let that = this
        var allCityList = wx.getStorageSync('all_city')
        if (allCityList != null && allCityList != undefined && allCityList.length > 0) {
            var provinces = []
            var citys = []
            for (var i = 0; i < allCityList.length; i++) {
                provinces.push(allCityList[i].name)
                var tmp = []
                for (var j = 0; j < allCityList[i].children.length; j++) {
                    tmp.push(allCityList[i].children[j].name)
                }
                citys.push(tmp)
            }
            // log.info(JSON.stringify([provinces, citys[that.data.registeredIndex[0]]]))
            that.setData({
                provinces: provinces,
                citys: citys,
                registeredArray: [provinces, citys[that.data.registeredIndex[0]]],
                residenceArray: [provinces, citys[that.data.registeredIndex[0]]],
                registeredProvince: provinces[that.data.registeredIndex[0]],
                registeredCity: citys[that.data.registeredIndex[0]][that.data.registeredIndex[1]],
                residenceProvince: provinces[that.data.residenceIndex[0]],
                residenceCity: citys[that.data.residenceIndex[0]][that.data.residenceIndex[1]],
            })

        } else {
            util.request(api.GetAllCityUrl, {}, 'POST').then(function(res) {
                // log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    var provinces = []
                    var citys = []
                    for (var i = 0; i < res.data.cityItems.length; i++) {
                        provinces.push(res.data.cityItems[i].name)
                        var tmp = []
                        for (var j = 0; j < res.data.cityItems[i].children.length; j++) {
                            tmp.push(res.data.cityItems[i].children[j].name)
                        }
                        citys.push(tmp)
                    }
                    // log.info(JSON.stringify([provinces, citys[that.data.registeredIndex[0]]]))
                    that.setData({
                        provinces: provinces,
                        citys: citys,
                        registeredArray: [provinces, citys[that.data.registeredIndex[0]]],
                        residenceArray: [provinces, citys[that.data.residenceArray[0]]],
                    })

                    // log.info(JSON.stringify(that.data.provinces))
                    wx.setStorageSync('all_city', res.data.cityItems)
                }
            }).catch(function(res) {
                log.info(JSON.stringify(res))
            })
        }
    },
    OnBasicInfo: function() {
        let that = this;
        util.request(api.BasicDetailUrl + "?id=" + that.data.uid, {}, 'POST')
            .then(function(res) {
                if (res.code == 200) {
                    log.info("BasicDetailUrl: " + JSON.stringify(res))
                    var item = res.data
                    that.data.id = item.id
                    that.data.uid = item.uid
                    that.data.nation = item.nation
                    if (item.gender != undefined) {
                        that.data.genderIndex = item.gender
                    }
                    if (item.marraigeStatus != undefined) {
                        that.data.marriageIndex = item.marraigeStatus
                    }
                    if (item.registeredResidenceProvince != undefined) {
                        that.data.registeredIndex = [that.data.provinces.indexOf(item.registeredResidenceProvince), that.data.citys[that.data.provinces.indexOf(item.registeredResidenceProvince)].indexOf(item.registeredResidenceCity)]
                        that.data.registeredProvince = item.registeredResidenceProvince,
                            that.data.registeredCity = item.registeredResidenceCity
                    } else {
                        that.data.registeredIndex = [0, 0]
                        that.data.registeredProvince = ""
                        that.data.registeredCity = ""
                    }
                    if (item.residenceProvince != undefined) {
                        that.data.residenceIndex = [that.data.provinces.indexOf(item.residenceProvince), that.data.citys[that.data.provinces.indexOf(item.residenceProvince)].indexOf(item.residenceCity)]
                        that.data.residenceProvince = item.residenceProvince
                        that.data.residenceCity = item.residenceCity
                    } else {
                        that.data.residenceIndex = [0, 0]
                        that.data.residenceProvince = ""
                        that.data.residenceCity = ""
                    }
                    if (item.zodiac != undefined) {
                        that.data.zodiacIndex = that.data.zodiacs.indexOf(item.zodiac)
                    } else {
                        that.data.zodiacIndex = 0
                    }
                    if (item.constellation != undefined) {
                        that.data.constellationIndex = that.data.constellations.indexOf(item.constellation)
                    } else {
                        that.data.constellationIndex = 0
                    }
                    that.data.sexualIndex = item.sexualOrientation
                    that.data.sexualDesc = item.sexualOrientationDesc
                    that.data.height = item.height
                    that.data.weight = item.weight
                    that.data.facialAttractiveness = item.facialAttractiveness
                    that.data.jobType = item.jobType
                    that.data.jobProof = item.jobProof
                    that.data.jobQuestion = item.jobQuestion
                    that.data.industry = item.industry
                    that.data.downPicIds = item.picIds

                    for (var i = 0; i < item.picIds.length; i++) {
                        that.data.downPicPaths.push(api.DownloadImageUrl + "?id=" + item.picIds[i])
                    }
                    that.data.uploadPicIds = []
                    that.data.uploadPicPaths = []
                        // log.info("that.data: " + JSON.stringify(that.data))

                    that.setData({
                            id: that.data.id,
                            uid: that.data.uid,
                            modify: false,
                            nation: that.data.nation,
                            marriageIndex: that.data.marriageIndex,
                            registeredProvince: that.data.registeredProvince,
                            registeredCity: that.data.registeredCity,
                            residenceProvince: that.data.residenceProvince,
                            residenceCity: that.data.residenceCity,
                            genderIndex: that.data.genderIndex,
                            residenceIndex: that.data.residenceIndex,
                            registeredIndex: that.data.registeredIndex,
                            zodiacIndex: that.data.zodiacIndex,
                            constellationIndex: that.data.constellationIndex,
                            sexualIndex: that.data.sexualIndex,
                            sexualDesc: that.data.sexualDesc,
                            height: that.data.height,
                            weight: that.data.weight,
                            facialAttractiveness: that.data.facialAttractiveness,
                            jobType: that.data.jobType,
                            jobProof: that.data.jobProof,
                            jobQuestion: that.data.jobQuestion,
                            industry: that.data.industry,
                            downPicIds: that.data.downPicIds,
                            downPicPaths: that.data.downPicPaths,
                            uploadPicIds: that.data.uploadPicIds,
                            uploadPicPaths: that.data.uploadPicPaths
                        })
                        // log.info("网落: " + JSON.stringify(that.data))
                }
            })
            /*.catch(function (res) {
                            log.info("basic_info failed: " + JSON.stringify(res))
                            wx.showModal({
                                title: '网络',
                                content: '请检查网络'
                            });
                        })*/
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     
    onReady: function () {
    },
    */

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},

    bindSexualDescChange: function(e) {
        // log.info('picker sexualDesc code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            sexualDesc: e.detail.value
        })
    },

    bindRegisteredMultiChange: function(e) {
        // log.info('picker registered  code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            registeredIndex: e.detail.value
        })
    },

    bindRegisteredMultiPickerColumnChange: function(e) {
        let that = this
            // log.info('picker registered  code 发生选择改变，携带值为' + JSON.stringify(e.detail));
        var data = {
            registeredArray: this.data.registeredArray,
            registeredIndex: this.data.registeredIndex
        };
        data.registeredIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                data.registeredArray[1] = this.data.citys[e.detail.value]
                that.setData({
                    registeredProvince: this.data.registeredArray[0][e.detail.value],

                    registeredCity: this.data.citys[e.detail.value][0]
                })
                break;
            case 1:
                that.setData({
                    registeredProvince: this.data.registeredArray[0][this.data.registeredIndex[0]],
                    registeredCity: this.data.registeredArray[1][e.detail.value]
                })
                break;
        }
        // log.info("registered " + JSON.stringify(that.data))
        that.setData(data);
    },

    bindResidenceMultiChange: function(e) {
        // log.info('picker residence  code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            residenceIndex: e.detail.value
        })
    },

    bindResidenceMultiPickerColumnChange: function(e) {
        // log.info('picker residence  code 发生选择改变，携带值为' + JSON.stringify(e.detail));
        let that = this
        var data = {
            residenceArray: this.data.residenceArray,
            residenceIndex: this.data.residenceIndex
        };
        data.residenceIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                data.residenceArray[1] = this.data.citys[e.detail.value]
                that.setData({
                    residenceProvince: this.data.residenceArray[0][e.detail.value],
                    residenceCity: this.data.citys[e.detail.value][0]
                })
                break;
            case 1:
                that.setData({
                    residenceProvince: this.data.residenceArray[0][this.data.residenceIndex[0]],
                    residenceCity: this.data.residenceArray[1][e.detail.value]
                })
                break;
        }
        // log.info("residence " + JSON.stringify(that.data))
        that.setData(data);
    },

    bindSexualChange: function(e) {
        // log.info('picker sexual code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            sexualIndex: e.detail.value
        })
    },

    bindGenderChange: function(e) {
        // log.info('picker gender code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            genderIndex: e.detail.value
        })
    },

    bindMarriageChange: function(e) {
        // log.info('picker marriage code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            marriageIndex: e.detail.value
        })
    },

    bindNationChange: function(e) {
        // log.info('picker gender code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            nation: e.detail.value
        })
    },

    bindHeightChange: function(e) {
        // log.info('picker gender code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            height: e.detail.value
        })
    },

    bindWeightChange: function(e) {
        // log.info('picker gender code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            weight: e.detail.value
        })
    },

    bindRegisteredChange: function(e) {
        // log.info('picker registered code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            registeredIndex: e.detail.value
        })
    },

    bindResidenceChange: function(e) {
        // log.info('picker residence code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            residenceIndex: e.detail.value
        })
    },

    bindIndustryChange: function(e) {
        // log.info('picker industry 发生选择改变，携带值为', e.detail.value);
        this.setData({
            industry: e.detail.value
        })
    },

    bindJobTypeChange: function(e) {
        // log.info('picker job_type 发生选择改变，携带值为', e.detail.value);
        this.setData({
            jobType: e.detail.value
        })
    },

    bindJobProofChange: function(e) {
        // log.info('picker job_proof 发生选择改变，携带值为', e.detail.value);
        this.setData({
            jobProof: e.detail.value
        })
    },

    bindJobQuestionChange: function(e) {
        // log.info('picker job_question 发生选择改变，携带值为', e.detail.value);
        this.setData({
            jobQuestion: e.detail.value
        })
    },

    bindFaceChange: function(e) {
        // log.info('picker job_question 发生选择改变，携带值为', e.detail.value);
        this.setData({
            facialAttractiveness: e.detail.value
        })
    },

    submitChange() {
        let that = this;
        this.selectComponent('#form').validate((valid, errors) => {
            that.setData({ modify: true });
        });
    },

    submitForm() {
        let that = this;
        this.selectComponent('#form').validate((valid, errors) => {
            // log.info('valid ', valid, errors)
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                console.log("iamges: " + JSON.stringify(that.data.images))
                for (var i = 0; i < that.data.images.length; i++) {
                    that.upImgs(that.data.images[i], i) //调用上传方法
                }
                util.sleep(1000);
                util.request(api.BasicInsertUrl, {
                        uid: that.data.uid,
                        gender: that.data.genderIndex,
                        nation: that.data.nation,
                        marriageStatus: that.data.marriageIndex,
                        registeredResidenceProvince: that.data.registeredProvince,
                        registeredResidenceCity: that.data.registeredCity,
                        residenceProvince: that.data.residenceProvince,
                        residenceCity: that.data.residenceCity,
                        height: that.data.height,
                        weight: that.data.weight,
                        bmi: that.data.weight / ((that.data.height / 100.0) * (that.data.height / 100.0)),
                        facialAttractiveness: that.data.facialAttractiveness,
                        sexualOrientation: that.data.sexualIndex,
                        sexualOrientationDesc: that.data.sexualDesc,
                        industry: that.data.industry,
                        jobType: that.data.jobType,
                        jobProof: that.data.jobProof,
                        jobQuestion: that.data.jobQuestion
                    },
                    'POST'
                ).then(function(res) {
                    console.log("submit: " + JSON.stringify(res))
                    if (res.code == 401) {
                        wx.showToast({
                            title: '暂未登录或token已经过期'
                        })
                    } else if (res.code == 200) {
                        wx.showToast({
                            title: '更新成功'
                        })
                        that.setData({
                            modify: false
                        })
                        that.OnBasicInfo()
                        that.onReady()

                    }
                })
            }
        })
    }
})