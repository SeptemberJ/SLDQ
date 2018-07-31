const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page( {
  data: {
    SearchDate_S:'请选择开始日期',
    SearchDate_E: '请选择结束日期',
    CurrentDate:'',
    ResultList: null,
    userRole: null
  },

  onLoad: function() {
    let Now = new Date();
    let BeforeOneDay = Now.setDate(Now.getDate() - 1)
    let R = new Date(BeforeOneDay)
    this.setData({
      CurrentDate: util.formatTimeSimple(R),
      userRole: app.globalData.userRole
    })
    
  },
  ChangeSearchDateS: function(e){
    this.setData({
      SearchDate_S: e.detail.value
    })
  },
  ChangeSearchDateE: function (e) {
    this.setData({
      SearchDate_E: e.detail.value
    })
  },
  Search: function(){
    let start = new Date(this.data.SearchDate_S);
    let afterMonth = start.setDate(start.getDate() + 31)
    if (this.data.SearchDate_S == '请选择开始日期' || this.data.SearchDate_E == '请选择结束日期'){
      wx.showToast({
        image: '../../images/attention.png',
        title: '请选择日期！'
      });
      return false;
    }
    //周期超出一个月
    if (afterMonth < (new Date(this.data.SearchDate_E)).getTime()){
      wx.showToast({
        image: '../../images/attention.png',
        title: '周期太长！'
      });
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + "/page/wanchengdate.do",
      data: {
        begindate: this.data.SearchDate_S,
        enddate: this.data.SearchDate_E,
        shifuid: app.globalData.userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, 
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          this.setData({
            ResultList: res.data.oredrpaylist
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/attention.png',
            title: '查询失败！'
          });
          break
        default:
          wx.showToast({
            image: '../../images/attention.png',
            title: '服务器繁忙！'
          });
          wx.hideLoading()
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
  
  
})