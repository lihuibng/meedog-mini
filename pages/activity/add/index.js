// pages/activity/add/index.js
var api = require('../../../config/api.js');
var util = require('../../../util/util.js');
var log = require('../../../util/log.js')
var app = getApp()

Page({

    /**
        * 页面的初始数据
       */
    data: {
      
      
      place: {
        name: "",
        score: 0.0,
        price: 0.0,
        province: "",
        city: "",
        district: "",
        address: "",
        latitude: 39.957894,
        longitude: 116.300896,
        accuracy:"",
        horizontalaccuracy: "",
        verticalaccuracy: "",
        altitude: 0.0,
        speed: "",
        location: {
          lat: 39.957894,
          lng: 116.300896
        },
        phone: "",
        tags: ""
      },
      width: 0,
      chosen: false,
      usid: 0,
      userNickName: "",
      userIcon: "",
      alipayQr: "",
      wepayQr: "",
      wechatOfficalLink: "",
      wechatGroupQr: "",
      name: "",
      address: "",
      organizerName: "",
      organizerWechat: "",
      organizerPhone: "",
      factoryStatus: "",
      activityDesc: "",
      participantLimit: "",
      start: "",
      end: "",
      // 标记点 当前位置
      markers: [],
      // 圆
      circles: [],
      // 控件 回到当前位置
      controls: [],
    },
  
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.setData({
        width: (app.globalData.systemInfo.windowWidth) / 4 - 16
    })
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
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    },
  
    // 选择位置
    selectedClick: function () {
      // 设置权限
      let that = this
  
          // 选择位置
          wx.chooseLocation({
            success: function (res) {
              console.log(res);
              that.setData({
                place: {
                  name: res.name,
                  location: {
                    lat: res.latitude,
                    lng: res.longitude
                  },
                  address: res.address,
                  accuracy: res.accuracy,
                  horizontalAccuracy: res.horizontalAccuracy,
                  speed: res.speed,
                  verticalAccuracy: res.verticalAccuracy
                },
                chosen: true
              }
              )
              console.log(JSON.stringify(that.data))
              // 打开位置
             /*wx.openLocation({
                latitude: res.latitude,
                longitude: res.longitude,
                name: res.name,
                address: res.address,
              })*/
            },
          })
        }
    ,
  
    regionChange: function (res) {
      // 改变中心点位置
      if (res.type == "end") {
        var thisBlock = this;
        this.mapCtx = wx.createMapContext("centerChange");
        this.mapCtx.getCenterLocation({
          success: function (res) {
            console.log(res);
  
            thisBlock.setData({
              latitude: res.latitude,
              longitude: res.longitude,
  
              markers: [{
                iconPath: "http://XXXXXX:8082/icon/img/location.png",
                id: 0,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 35,
                height: 35,
                title: "当前位置",
                callout: {
                  padding: 10,
                  content: "当前位置",
                  bgColor: "#DC143C",
                  color: "#FFFF00",
                  display: "ALWAYS"
                },
                label: { content: "标题" },
                anchor: {}
              }],
            })
          }
        })
      }
    },
  
    // 回到当前位置
    controlClick: function (res) {
      console.log(res);
      var thisBlock = this;
  
      wx.getLocation({
        type: "wgs84",
        success: function (res) {
          console.log(res);
  
          thisBlock.setData({
            latitude: res.latitude,
            longitude: res.longitude,
  
            markers: [{
              iconPath: "http://XXXXXX:8082/icon/img/location.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 35,
              height: 35,
              title: "当前位置",
              callout: {
                padding: 10,
                content: "当前位置",
                bgColor: "#DC143C",
                color: "#FFFF00",
                display: "ALWAYS"
              },
              label: { content: "标题" },
              anchor: {}
            }],
          })
        },
      })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
  
      // 获取当前位置
      var thisBlock = this;
      wx.getLocation({
        type: "wgs84",
        success: function (res) {
          console.log(res);
  
          thisBlock.setData({
            latitude: res.latitude,
            longitude: res.longitude,
  
            markers: [{
              iconPath: "http://XXXXXX:8082/icon/img/location.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 35,
              height: 35,
              title: "当前位置",
              callout: {
                padding: 10,
                content: "当前位置",
                bgColor: "#DC143C",
                color: "#FFFF00",
                display: "ALWAYS"
              },
              label: { content: "标题" },
              anchor: {}
            }],
  
            circles: [{
              latitude: res.latitude,
              longitude: res.longitude,
              radius: 10,
              strokeWidth: 2,
              fillColor: "#FAFAD2",
              color: "#90EE90"
            }],
  
            controls: [{
              id: 1001,
              position: { left: 10, top: 10, width: 35, height: 35 },
              iconPath: "../../../static/img/location.png",
              clickable: true
            }],
          })
        },
      })
    },
  
   
  })