// pages/search/city/city.js
var log = require('../../../util/log.js') // 引用上面的log.js文件
const res = {
    result: [
        [{
            cidx: [0, 15],
            fullname: "北京市",
            id: "110000",
            location: {
                lat: 39.90469,
                lng: 116.40717
            },
            name: "北京",
            pinyin: ["bei", "jing"]
        }, {
            cidx: [16, 31],
            fullname: "天津市",
            id: "120000",
            location: { lat: 39.0851, lng: 117.19937 },
            name: "天津",
            pinyin: ["tian", "jin"]
        }, {
            cidx: [32, 42],
            fullname: "河北省",
            id: "130000",
            location: { lat: 38.03599, lng: 114.46979 },
            name: "河北",
            pinyin: ["he", "bei"],
        }, {
            cidx: [43, 53],
            fullname: "山西省",
            id: "140000",
            location: { lat: 37.87343, lng: 112.56272 },
            name: "山西",
            pinyin: ["shan", "xi"],
        }]
    ]
}
Page({
    onLoad(options) {
        this.getCitys()
    },
    onChoose(e) {
        // log.info('onChoose', e)
    },
    getCitys() {
        const _this = this
        const cities = res.result[0]
        // 按拼音排序
        cities.sort((c1, c2) => {
            let pinyin1 = c1.pinyin.join('')
            let pinyin2 = c2.pinyin.join('')
            return pinyin1.localeCompare(pinyin2)
        })
        // 添加首字母
        const map = new Map()
        for (const city of cities) {
            const alpha = city.pinyin[0].charAt(0).toUpperCase()
            if (!map.has(alpha)) map.set(alpha, [])
            map.get(alpha).push({ name: city.fullname })
        }

        const keys = []
        for (const key of map.keys()) {
            keys.push(key)
        }
        keys.sort()

        const list = []
        for (const key of keys) {
            list.push({
                alpha: key,
                subItems: map.get(key)
            })
        }
        _this.setData({ list })
    }

})