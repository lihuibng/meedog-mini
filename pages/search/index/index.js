// pages/search/index/index.js
var api = require('../../../config/api.js');
var util = require('../../../util/util.js');
var log = require('../../../util/log.js') // 引用上面的log.js文件

var app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

const APP = getApp()
    // fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('mallName')
        })
    },

    Page({
        data: {
            dialogShow: false,
            userCount: 0,
            userList: [],
            recUserList: [],
            inputVal: "",
            activeIndex: 0,
            // 搜索框状态
            inputShowed: true,
            //显示结果view的状态
            viewShowed: false,
            // 搜索框值
            inputVal: "",
            loverDynamic: [{ nick: 'hello world', name: 'world' }, { nick: 'hello2', name: 'world2' }],
            //搜索渲染推荐数据
            list: [{
                    "deviceId": "001",
                    "name": "abcaaaaaaaa"
                },
                {
                    "deviceId": "002",
                    "name": "bcdaaaaaaaaa"
                }
            ],
            inputVal: "", // 搜索框内容
            goodsRecommend: [], // 推荐商品
            kanjiaList: [], //砍价商品列表
            pingtuanList: [], //拼团商品列表
            loadingHidden: false, // loading
            selectCurrent: 0,
            noticeList: { dataList: [{ id: 1, title: "商城新开，优惠多多" }, { id: 2, title: "商城新开，优惠多多" }] },
            categories: [{ id: 1, icon: 'http://XXXXXX:8082/icon/img/address.png', name: "京房" }, { id: 2, icon: 'http://XXXXXX:8082/icon/img/address.png', name: "京户" }, { id: 3, icon: 'http://XXXXXX:8082/icon/img/address.png', name: "90后" }, { id: 4, icon: 'http://XXXXXX:8082/icon/img/address.png', name: "程序员" }, { id: 5, icon: 'http://XXXXXX:8082/icon/img/address.png', name: "公务员" }],
            activeCategoryId: 0,
            goods: [],
            scrollTop: 0,
            loadingMoreHidden: true,
            coupons: [],
            curPage: 1,
            pageSize: 20,
            cateScrollTop: 0,
            banners: [{ id: 1, linkUrl: '../../user/basic_info/basic_info', picUrl: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png' }, { id: 2, linkUrl: '../../user/education_list/education_list', picUrl: 'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png' }],
            pickerHidden: true,
            chosen: '',
            ageLow: 22,
            ageHigh: 30,
            heightLow: 165,
            heightHigh: 170,
            salaryValue: 30,
            colleges: ["吉林大学"],
            college_index: 0,
            search_condition_show: false,
            searchCondition: false,
            //degrees: [{ name: "高中以下", value: [0, 1, 2, 3, 4], checked: false }, { name: "大专", value: [5, 6], checked: false }, { name: "本科", value: [7, 8], checked: false }, { name: "硕士", value: [9, 10], checked: false }, { name: "博士", value: [11, 12, 13], checked: false }],
            degrees: [{ "name": "没读过书", "value": 0, "checked": false }, { "name": "小学", "value": 1, "checked": false }, { "name": "初中", "value": 2, "checked": false }, { "name": "中专", "value": 3, "checked": false }, { "name": "高中", "value": 4, "checked": false }, { "name": "大专", "value": 5, "checked": false }, { "name": "成人本科", "value": 6, "checked": false }, { "name": "本科", "value": 7, "checked": false }, { "name": "在职研究生", "value": 8, "checked": false }, { "name": "硕士", "value": 9, "checked": false }, { "name": "MBA", "value": 10, "checked": false }, { "name": "博士", "value": 11, "checked": false }, { "name": "博士后", "value": 12, "checked": false }, { "name": "其他", "value": 13, "checked": false }],
            mirraiges: [{ "name": "单身", "value": 0, "checked": false }, { "name": "恋爱", "value": 1, "checked": false }, { "name": "订婚", "value": 2, "checked": false }, { "name": "结婚", "value": 3, "checked": false }, { "name": "离异", "value": 4, "checked": false }],
            districts: [],
            households: [],
            collegeStatus: [],
            constellations: [{ "name": "白羊", "value": 1, "checked": false }, { "name": "金牛", "value": 2, "checked": false }, { "name": "双子", "value": 3, "checked": false }, { "name": "巨蟹", "value": 4, "checked": false }, { "name": "狮子", "value": 5, "checked": false }, { "name": "处女", "value": 6, "checked": false }, { "name": "天秤", "value": 7, "checked": false }, { "name": "天蝎", "value": 8, "checked": false }, { "name": "射手", "value": 9, "checked": false }, { "name": "摩羯", "value": 10, "checked": false }, { "name": "水瓶", "value": 11, "checked": false }, { "name": "双鱼", "value": 12, "checked": false }],
            zodiacs: [{ "name": "鼠", "value": 1, "checked": false }, { "name": "牛", "value": 2, "checked": false }, { "name": "虎", "value": 3, "checked": false }, { "name": "兔", "value": 4, "checked": false }, { "name": "龙", "value": 5, "checked": false }, { "name": "蛇", "value": 6, "checked": false }, { "name": "马", "value": 7, "checked": false }, { "name": "羊", "value": 8, "checked": false }, { "name": "猴", "value": 9, "checked": false }, { "name": "鸡", "value": 10, "checked": false }, { "name": "狗", "value": 11, "checked": false }, { "name": "猪", "value": 12, "checked": false }]
        },
        bindMarriageChange: function(e) {

            let that = this
            var items = that.data.marriages;
            log.info(that.data.marriages)

            for (let i = 0, len = items.length; i < len; ++i) {
                items[i].checked = false
            }
            for (let i = 0, len = items.length; i < len; ++i) {
                items[i].checked = items[i].name === e.detail.value
            }
            that.setData({
                marriages: items,
            });
        },
        bindDegreeChange: function(e) {
            var items = this.data.degrees;
            for (let i = 0, len = items.length; i < len; ++i) {
                items[i].checked = items[i].name === e.detail.value
            }
            this.setData({
                degrees: items
            });
        },

        bindCollegeStatusChange: function(e) {
            var items = this.data.collegeStatus;
            for (let i = 0, len = items.length; i < len; ++i) {
                items[i].checked = items[i].name === e.detail.value
            }
            this.setData({
                degreeStatus: items
            });
        },

        bindSearchTap: function(e) {
            this.setData({
                search_condition_show: true
            })
            this.onZodiac()
            this.onConstellation()
            this.onMarriage()
            this.onDegree()
            this.onCollegeStatus()
            this.onHouseholds()
            if (this.data.uid == undefined) {
                this.setData({
                    uid: wx.getStorageSync('mdUserId')
                })
            }
            this.onDistrict(this.data.uid)
        },
        salaryChange: function(e) {
            this.setData({
                salaryValue: e.detail.value
            })
        },
        salaryChanging: function(e) {
            this.setData({
                salaryValue: e.detail.value
            })
        },

        ageLowChange: function(e) {
            this.setData({
                ageLow: e.detail.lowValue
            })
        },

        ageHighChange: function(e) {
            this.setData({
                ageHigh: e.detail.heighValue
            })
        },

        heightLowChange: function(e) {
            this.setData({
                heightLow: e.detail.lowValue
            })
        },

        heightHighChange: function(e) {
            this.setData({
                heightHigh: e.detail.heighValue
            })
        },

        householdsChange: function(e) {
            var items = this.data.households;
            for (let i = 0, len = items.length; i < len; ++i) {
                items[i].checked = items[i].name === e.detail.value
            }
            this.setData({
                households: items
            });
        },

        districtChange: function(e) {
            var checkboxItems = this.data.districts,
                values = e.detail.value;
            for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
                for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                    if (checkboxItems[i].district == values[j]) {
                        checkboxItems[i].checked = true;
                        break;
                    }
                }
            }
            this.setData({
                districts: checkboxItems
            });
        },

        zodiacChange: function(e) {
            var checkboxItems = this.data.zodiacs,
                values = e.detail.value;
            for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
                for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                    if (checkboxItems[i].name == values[j]) {
                        checkboxItems[i].checked = true;
                        break;
                    }
                }
            }
            this.setData({
                zodiacs: checkboxItems
            });
        },

        constellationChange: function(e) {
            var checkboxItems = this.data.constellations,
                values = e.detail.value;
            for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
                for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                    if (checkboxItems[i].name == values[j]) {
                        checkboxItems[i].checked = true;
                        break;
                    }
                }
            }
            this.setData({
                constellations: checkboxItems
            });
        },


        onShareAppMessage() {
            return {
                title: 'form',
                path: 'page/component/pages/form/form'
            }
        },

        submitForm: function(e) {
            var str = "";
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
                    that.search(that.data)
                }
            })
        },
        foldForm: function(e) {
            this.setData({ search_condition_show: false })
        },

        resetForm: function(e) {
            /*if (.currnetTarget.dataset.fn) {
              //执行原跳转事件
              this[.currentTarget.dataset.fn]();
            }*/
            //log.info('form发生了reset事件，携带数据为：', e.detail.value)
            var items1 = this.data.districts;
            for (var i = 0, lenI = items1.length; i < lenI; ++i) {
                items1[i].checked = false;
            }
            var items2 = this.data.households;
            for (var i = 0, lenI = items2.length; i < lenI; ++i) {
                items2[i].checked = false;
            }
            this.setData({
                ageLow: 22,
                ageHigh: 30,
                heightLow: 165,
                heightHigh: 170,
                salaryValue: 30,
                colleges: ["吉林大学"],
                college_index: 0,
                marriageStatus: "",
                degreeStatus: "",
                districts: items1,
                households: items2,
                searchCondition: false
            })
        },

        btn_clicked: function(e) {
            this.setData({
                btn_name: "按过了.",
                dialogShow: true,
            })
        },
        goGifts: function(e) {
            wx.switchTab({
                url: "/pages/gifts/index"
            })
        },
        toDetailsTap: function(e) {
            log.info("toDetailsTap: " + JSON.stringify(e))
            wx.navigateTo({
                url: "../../../pages/user/detail/index?id=" + e.currentTarget.dataset.id
            })
        },
        tabClick: function(e) {
            const category = this.data.categories.find(ele => {
                return ele.id == e.currentTarget.dataset.id
            })
            if (category.vopCid1 || category.vopCid2) {
                wx.navigateTo({
                    url: '/pages/goods/list-vop?cid1=' + (category.vopCid1 ? category.vopCid1 : '') + '&cid2=' + (category.vopCid2 ? category.vopCid2 : ''),
                })
            } else {
                wx.setStorageSync("_categoryId", category.id)
                wx.switchTab({
                    url: '/pages/category/category',
                })
            }
        },
        goNotice(e) {
            const id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/notice/show?id=' + id,
            })
        },
        tapBanner: function(e) {
            const url = e.currentTarget.dataset.url
            if (url) {
                wx.navigateTo({
                    url
                })
            }
        },

        showInput: function() {
            this.setData({
                inputShowed: true
            });
        },
        // 隐藏搜索框样式
        hideInput: function() {
            this.setData({
                inputVal: "",
                inputShowed: false
            });
        },
        // 清除搜索框值
        clearInput: function() {
            this.setData({
                inputVal: ""
            });
        },
        // 键盘抬起事件
        inputTyping: function(e) {
            // log.info(e.detail.value)
            var that = this;
            if (e.detail.value == '') {
                return;
            }
            that.setData({
                viewShowed: false,
                inputVal: e.detail.value
            });
            that.setData({
                list: [{
                        "deviceId": "001",
                        "name": "abcaaaaaaaa"
                    },
                    {
                        "deviceId": "002",
                        "name": "bcdaaaaaaaaa"
                    }
                ]
            })
        },
        // 获取选中推荐列表中的值
        btn_name: function(res) {
            var that = this;
            that.hideInput();
            // log.info('name:  ' + res.currentTarget.dataset.name);
        },

        onLoad() {
            getApp().launchPromise.then(() => {
                let that = this;
                util.checkLogin().then(function(res) {
                    that.data.mdToken = app.globalData.mdToken;
                    that.data.uid = app.globalData.uid;
                    if (that.data.uid == undefined || that.data.uid == '') {
                        that.data.uid = wx.getStorageSync('mdUserId')
                    }
                    that.onZodiac()
                    that.onConstellation()
                    that.onMarriage()
                    that.onDegree()
                    that.onCollegeStatus()
                    that.onHouseholds()
                    that.onDistrict(that.data.uid)
                    that.search()
                }).catch(function(res) {
                    log.info("checkLogin failed: " + JSON.stringify(res))
                    wx.navigateTo({
                        url: '../../auth/login/login',
                    })
                })

                this.setData({
                    search: this.search.bind(this)
                })
            })
        },
        onHouseholds: function(e) {
            let that = this
            var householdsList = wx.getStorageSync('households')
            if (householdsList.length > 0) {
                that.setData({
                    households: householdsList
                })
            } else {
                util.request(api.GetHouseholdsUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            households: res.data.householdsItems
                        })
                        log.info(JSON.stringify(that.data.householdsItems))
                        wx.setStorageSync('households', res.data.householdsItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },
        onDistrict: function(e) {
            if (e === undefined || e == null || e == "") {
                e = wx.getStorageSync('mdUserId')
            }
            let that = this
            var districtList = wx.getStorageSync('district')
            if (districtList.length > 0) {
                that.setData({
                    districts: districtList
                })
            } else {
                util.request(api.GetDistrictUrl + "?uid=" + e, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        if (res.data.hasOwnProperty('houseDistrictItems')) {
                            that.setData({
                                districts: res.data.houseDistrictItems
                            })
                            log.info(JSON.stringify(that.data.districts))
                            wx.setStorageSync('district', res.data.houseDistrictItems)
                        }
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },

        onCollegeStatus: function(e) {
            let that = this
            var collegeStatusList = wx.getStorageSync('college_status')
            if (collegeStatusList.length > 0) {
                that.setData({
                    collegeStatus: collegeStatusList
                })
            } else {
                util.request(api.GetCollegeStatusUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            collegeStatus: res.data.collegeStatusItems
                        })
                        log.info(JSON.stringify(that.data.collegeStatus))
                        wx.setStorageSync('college_status', res.data.collegeStatusItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },

        onDegree: function(e) {
            let that = this
            var degreeList = wx.getStorageSync('degree')
            if (degreeList.length > 0) {
                that.setData({
                    degrees: degreeList
                })
            } else {
                util.request(api.GetDegreeUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            degrees: res.data.degreeItems
                        })
                        log.info(JSON.stringify(that.data.degreeItems))
                        wx.setStorageSync('degree', res.data.degreeItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },

        onMarriage: function(e) {
            let that = this
            var marriageList = wx.getStorageSync('marriage_status')
            if (marriageList.length > 0) {
                that.setData({
                    marriages: marriageList
                })
            } else {
                util.request(api.GetMarriageUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            marriages: res.data.marriageStatusItems
                        })
                        log.info(JSON.stringify(that.data.marriages))
                        wx.setStorageSync('marriage_status', res.data.marriageStatusItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },

        onConstellation: function(e) {
            let that = this
            var constellationList = wx.getStorageSync('constellation')
            if (constellationList.length > 0) {
                that.setData({
                    constellations: constellationList
                })
            } else {
                util.request(api.GetConstellationUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            constellations: res.data.constellationItems
                        })
                        log.info(JSON.stringify(that.data.constellations))
                        wx.setStorageSync('constellation', res.data.constellationItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },
        onZodiac: function(e) {
            let that = this
            var zodiacList = wx.getStorageSync('zodiac')
            if (zodiacList.length > 0) {
                that.setData({
                    zodiacs: zodiacList
                })
            } else {
                util.request(api.GetZodiacUrl, {}, 'POST').then(function(res) {
                    log.info("wyg: " + JSON.stringify(res))
                    if (res.code == 200) {
                        that.setData({
                            zodiacs: res.data.zodiacItems
                        })
                        log.info(JSON.stringify(that.data.zodiacs))
                        wx.setStorageSync('zodiac', res.data.zodiacItems)
                    }
                }).catch(function(res) {
                    log.info(JSON.stringify(res))
                })
            }
        },

        search: function(value) {
            let that = this

            // log.info('ssss ' + value)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    //log.info(typeof (value))
                    var params = {}
                    if (this.data.searchCondition == false) {
                        //log.info("String:" + JSON.stringify(params))
                        params["keyword"] = value
                        params["uid"] = that.data.uid
                    } else if (this.data.searchCondition == true) {
                        //log.info("Object:" + JSON.stringify(params))
                        params['ageLow'] = that.data.ageLow,
                            params['ageHigh'] = that.data.ageHigh,
                            params['heightLow'] = that.data.heightLow,
                            params['heightHigh'] = that.data.heightHigh,
                            params['salaryValue'] = that.data.salaryValue,
                            params['college'] = that.data.colleges[this.data.college_index],
                            params['marriages'] = []
                        params['degrees'] = []
                        params['districts'] = []
                        params['households'] = []
                        params['keyword'] = ""
                        params["uid"] = that.data.uid
                        var districtItems = that.data.districts;
                        for (var i = 0; i < districtItems.length; i++) {
                            if (districtItems[i].checked == true) {
                                params['districts'].push(districtItems[i].district)
                            }
                        }
                        var householdsItems = that.data.households;
                        for (var i = 0; i < householdsItems.length; i++) {
                            if (householdsItems[i].checked == true) {
                                params['households'].push(householdsItems[i].name)
                            }
                        }

                        var marriageStatusItems = that.data.marriageStatus;
                        for (var i = 0; i < marriageStatusItems.length; i++) {
                            if (marriageStatusItems[i].checked == true) {
                                params['marriageStatus'] = params['marriageStatus'].concat(marriageStatusItems[i].value)
                            }
                        }

                        var collegeStatusItems = that.data.collegeStatus;
                        for (var i = 0; i < collegeStatusItems.length; i++) {
                            if (collegeStatusItems[i].checked == true) {
                                params['collegeStatus'] = params['collegeStatus'].concat(collegeStatusItems[i].value)
                            }
                        }

                        var zodiacItems = that.data.zodiacItems;
                        for (var i = 0; i < zodiacItems.length; i++) {
                            if (zodiacItems[i].checked == true) {
                                params['zodiacs'] = params['zodiacs'].concat(zodiacItems[i].value)
                            }
                        }
                        var constellationItems = that.data.constellationItems;
                        for (var i = 0; i < constellationItems.length; i++) {
                            if (constellationItems[i].checked == true) {
                                params['constellations'] = params['constellations'].concat(constellationItems[i].value)
                            }
                        }

                        var collegeStatusItems = that.data.collegeStatus;
                        for (var i = 0; i < collegeStatusItems.length; i++) {
                            if (collegeStatusItems[i].checked == true) {
                                params['collegeStatus'] = params['collegeStatus'].concat(collegeStatusItems[i].value)
                            }
                        }

                    } else {
                        log.info("else:" + JSON.stringify(params))
                        params['keyword'] = ""
                    }

                    util.request(api.SearchIndexUrl, params, 'POST').then(function(res) {
                        var l = res.data.list
                        for (var i = 0; i < l.length; i++) {
                            l[i].picId = api.DownloadImageUrl + "?id=" + l[i].picId
                            l[i].birthday = l[i].birthday.substring(0, 4)
                            l[i].degree = that.data.degrees[[l[i].degree]].name
                        }
                        log.info("search result: hello " + JSON.stringify(l))
                        that.setData({
                            lover: l
                        })
                    }).catch(function(res) {
                        log.info("failed: search result: hello " + JSON.stringify(res))
                    })
                }, 12000)

            })
        },

        selectResult: function(e) {
            log.info('select result  ', e.detail)
        },

        onReady: function() {},

        onShow: function() {},

        onHide: function() {},

        onUnload: function() {},

        onPullDownRefresh: function() {
            wx.startPullDownRefresh()
        },

        onReachBottom: function() {},

        onShareAppMessage: function() {
            return {
                title: '米小狗',
                desc: '米小狗婚恋交友',
                path: '../../../pages/search/index/index'
            }
        }
    })