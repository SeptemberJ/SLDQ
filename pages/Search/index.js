const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page( {
  data: {
    SearchDate:'请选择查询日期',
    CurrentDate:'',
    ResultList: null
    
  },

  onLoad: function() {
    this.setData({
      //SearchDate: util.formatTimeSimple(new Date()),
      CurrentDate: util.formatTimeSimple(new Date())
    })
    
  },
  ChangeSearchDate: function(e){
    this.setData({
      SearchDate: e.detail.value
    })
  },
  Search: function(){
    if (this.data.SearchDate == '请选择查询日期'){
      wx.showToast({
        image: '../../images/attention.png',
        title: '请选择日期！'
      });
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + "/page/wanchengdate.do",
      data: {
        date: this.data.SearchDate,
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