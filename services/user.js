const util = require('../util/util.js');
const api = require('../config/api.js');
var log = require('../util/log')

function loginByWeixin() {
    return new Promise(function(resolve, reject) {
        return util.login().then((res) => {
            return res.code;
        }).then((code) => {
            let params = {};
            params.code = code;
            params.userId = wx.getStorageSync('userId') || 0;
            util.request(api.WechatLoginUrl, params, 'POST').then(res => {
                if (res.code === 200) {
                    wx.setStorageSync('openid', res.data.openid);
                    wx.setStorageSync('isReal', true);
                    wx.setStorageSync('uId', res.data.userid);
                    wx.setStorageSync('Authorization', res.data.tokenHead + res.data.token)
                    if (wx.getStorageSync('userId')) {
                        wx.removeStorageSync('userId');
                    }
                    resolve(res);
                } else {
                    util.showErrorToast(res.message)
                    reject(res);
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

function checkLogin() {
    log.info("checkLogin");
    return new Promise(function(resolve, reject) {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
            util.checkSession().then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });
        } else {
            reject(false);
        }
    });
}

module.exports = {
    loginByWeixin,
    checkLogin
};