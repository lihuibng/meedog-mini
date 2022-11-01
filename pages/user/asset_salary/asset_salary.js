// pages/user/asset_salary/asset_salary.js
const api = require("../../../config/api");
const util = require("../../../util/util");
var log = require('../../../util/log.js') // 引用上面的log.js文件
const app = getApp()

/*const customCallout2 = {
    id: 3,
    latitude: 23.096994,
    longitude: 113.324520,
    iconPath: '../../../static/img/WechatIMG4.png',
    customCallout: {
        anchorY: 10,
        anchorX: 0,
        display: 'ALWAYS',
    },
}
const allMarkers = [customCallout2]
*/
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //latitude: 23.096994,
        //longitude: 113.324520,
        //markers: [],
        modify: true,
        citys: [],
        districtes: [],
        cityArray: [
            ["北京市"],
            ["西城区"]
        ],
        cityIndex: [0, 0],
        benchmarkMap: {},
        city: "",
        district: "",
        house_desc: "海淀三方",
        house_asset: 0,
        salary_asset: 0,
        deposit_asset: 0,
        other_asset: 0,
        wealth_score: 0,
        wealth_rank: 0,
        uid: "",
        mdToken: "",
        house_benchmark: 0,
        salary_benchmark: 0,
        deposit_benchmark: 0,
        other_asset_benchmark: 0,
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
                if (that.data.uid == '') {
                    that.data.uid = wx.getStorageSync('mdUserId')
                }
                that.onCity(that.data.uid)
                that.onAssetBenchmark(that.data.uid)

            }).catch(function(res) {
                wx.navigateTo({
                    url: '../../auth/login/login',
                })
            })
        })
    },

    onAssetBenchmark: function(e) {
        let that = this;
        util.request(api.AssetBenchmarkDetailUrl + "?id=" + e, {}, 'POST').then(function(res) {
            if (res.code == 200) {
                log.info(JSON.stringify(res))
                var benchmarkMap = {}
                if (res.data.length > 0) {
                    for (var i in res.data) {
                        var district = {}
                        if (res.data[i].city in benchmarkMap) {} else {
                            benchmarkMap[res.data[i].city] = {}
                        }
                        benchmarkMap[res.data[i].city][res.data[i].district] = [
                            res.data[i].houseBenchmark,
                            res.data[i].salaryBenchmark,
                            res.data[i].depositBenchmark,
                            res.data[i].otherAssetBenchmark,
                        ]
                    }
                    that.setData({
                        benchmarkMap: benchmarkMap,
                        house_benchmark: benchmarkMap[that.data.citys[that.data.cityIndex[0]]][that.data.districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]][0],
                        salary_benchmark: benchmarkMap[that.data.citys[that.data.cityIndex[0]]][that.data.districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]][1],
                        deposit_benchmark: benchmarkMap[that.data.citys[that.data.cityIndex[0]]][that.data.districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]][2],
                        other_asset_benchmark: benchmarkMap[that.data.citys[that.data.cityIndex[0]]][that.data.districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]][3]
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    bindCityMultiChange: function(e) {
        log.info('picker city  code 发生选择改变，携带值为', e.detail.value);
        this.setData({
            cityIndex: e.detail.value,
            house_benchmark: this.data.benchmarkMap[this.data.citys[e.detail.value[0]]][this.data.districtes[e.detail.value[0]][e.detail.value[1]]][0],
            salary_benchmark: this.data.benchmarkMap[this.data.citys[e.detail.value[0]]][this.data.districtes[e.detail.value[0]][e.detail.value[1]]][1],
            deposit_benchmark: this.data.benchmarkMap[this.data.citys[e.detail.value[0]]][this.data.districtes[e.detail.value[0]][e.detail.value[1]]][2],
            other_asset_benchmark: this.data.benchmarkMap[this.data.citys[e.detail.value[0]]][this.data.districtes[e.detail.value[0]][e.detail.value[1]]][3]
        })
    },

    bindCityMultiPickerColumnChange: function(e) {
        log.info('picker residence  code 发生选择改变，携带值为' + JSON.stringify(e.detail));
        let that = this
        var data = {
            cityArray: this.data.cityArray,
            cityIndex: this.data.cityIndex
        };
        data.cityIndex[e.detail.column] = e.detail.value;

        switch (e.detail.column) {
            case 0:
                data.cityArray[1] = this.data.districtes[e.detail.value]
                that.setData({
                    city: this.data.cityArray[0][e.detail.value],
                    district: this.data.citys[e.detail.value][0]
                })
                break;
            case 1:
                that.setData({
                    city: this.data.cityArray[0][this.data.cityIndex[0]],
                    district: this.data.cityArray[1][e.detail.value]
                })
                break;
        }
        log.info("city" + JSON.stringify(that.data))
        that.setData(data);
    },

    onCity: function(e) {
        let that = this
        var cityList = wx.getStorageSync('city')
        if (cityList.length > 0) {
            var citys = []
            var districtes = []
            for (var i = 0; i < cityList.length; i++) {
                citys.push(cityList[i].name)
                var tmp = []
                for (var j = 0; j < cityList[i].children.length; j++) {
                    tmp.push(cityList[i].children[j].name)
                }
                districtes.push(tmp)
            }
            log.info(JSON.stringify([citys, districtes[that.data.cityIndex[0]]]))
            that.setData({
                citys: citys,
                districtes: districtes,
                cityArray: [citys, districtes[that.data.cityIndex[0]]],
                city: citys[that.data.cityIndex[0]],
                district: districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]
            })

        } else {
            util.request(api.GetCityUrl + "?uid=" + e, {}, 'POST').then(function(res) {
                log.info("wyg: " + JSON.stringify(res))
                if (res.code == 200) {
                    var citys = []
                    var districtes = []
                    for (var i = 0; i < res.data.cityItems.length; i++) {
                        citys.push(res.data.cityItems[i].name)
                        var tmp = []
                        for (var j = 0; j < res.data.cityItems[i].children.length; j++) {
                            tmp.push(res.data.cityItems[i].children[j].name)
                        }
                        districtes.push(tmp)
                    }
                    log.info(JSON.stringify([citys, districtes[that.data.cityIndex[0]]]))
                    that.setData({
                        citys: citys,
                        districtes: districtes,
                        cityArray: [citys, districtes[that.data.cityIndex[0]]],
                        city: citys[that.data.cityIndex[0]],
                        district: districtes[that.data.cityIndex[0]][that.data.cityIndex[1]]
                    })

                    log.info(JSON.stringify(that.data.citys))
                    wx.setStorageSync('city', res.data.cityItems)
                }
            }).catch(function(res) {
                log.info(JSON.stringify(res))
            })
        }
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

    bindInputCity(event) {
        this.setData({
            cityIndex: event.detail.value,
            [`formData.cityIndex`]: event.detail.value,
            districtItems: this.data.cityMap[this.data.cityItems[event.detail.value]],
            districtIndex: 0,
            [`formData.districtIndex`]: 0,
            house_benchmark: this.data.benchmarkMap[this.data.cityItems[event.detail.value]][this.data.districtItems[0]][0],
            salary_benchmark: this.data.benchmarkMap[this.data.cityItems[event.detail.value]][this.data.districtItems[0]][1],
            deposit_benchmark: this.data.benchmarkMap[this.data.cityItems[event.detail.value]][this.data.districtItems[0]][2],
            other_asset_benchmark: this.data.benchmarkMap[this.data.cityItems[event.detail.value]][this.data.districtItems[0]][3],
        });

    },

    bindInputDistrict(event) {
        this.setData({
            districtIndex: event.detail.value,
            [`formData.districtIndex`]: event.detail.value,
            house_benchmark: this.data.benchmarkMap[this.data.cityItems[this.data.cityIndex]][this.data.districtItems[event.detail.value]][0],
            salary_benchmark: this.data.benchmarkMap[this.data.cityItems[this.data.cityIndex]][this.data.districtItems[event.detail.value]][1],
            deposit_benchmark: this.data.benchmarkMap[this.data.cityItems[this.data.cityIndex]][this.data.districtItems[event.detail.value]][2],
            other_asset_benchmark: this.data.benchmarkMap[this.data.cityItems[this.data.cityIndex]][this.data.districtItems[event.detail.value]][3],
        });
        log.info(JSON.stringify(this.data))
    },

    bindInputHouseDesc(event) {
        this.setData({
            house_desc: event.detail.value
        });
    },
    bindInputHouseAsset(event) {
        this.setData({
            house_asset: event.detail.value
        });
    },
    bindInputDeposit(event) {
        this.setData({
            deposit_asset: event.detail.value
        });
    },

    bindInputSalary(event) {
        this.setData({
            salary_asset: event.detail.value
        });
    },

    bindInputOther(event) {
        this.setData({
            other_asset: event.detail.value
        });
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
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                util.request(api.AssetInsertUrl, {
                        uid: that.data.uid,
                        houseDesc: that.data.house_desc,
                        asset: that.data.house_asset,
                        deposit: that.data.deposit_asset,
                        salary: that.data.salary_asset,
                        other: that.data.other_asset,
                        score: that.data.score
                    },
                    'POST'
                ).then(function(res) {
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
            }
        })
    }
})