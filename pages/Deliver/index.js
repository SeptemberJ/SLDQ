const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    OrderList: [],
    ifShowModal: false
  },

  onLoad: function (Options) {
    this.GetOrderList()
  },
  //查看详情
  Detail: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + '/page/detail.do',
      data: {
        id: e.currentTarget.dataset.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }, // 设置请求的 header
    }).then((res) => {
      console.log('detail backInfo---')
      console.log(res.data)
      let temp = res.data[0]
      if (res.data[0].fgodate) {
        temp.fgodate = res.data[0].fgodate.substring(0, 10)
        // temp.fgodate = res.data[0].fgodate.split('.')[0]
      } else {
        temp.fgodate = '无要求'
      }
      this.setData({
        OrderDetail: temp,
        modifyDate: temp.fgodate,
        ifShowModal: true
      })
      wx.hideLoading()

    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: '../../images/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
  //关闭详情
  DetailClose: function () {
    this.setData({
      ifShowModal: false
    })
  },
  //确认送货
  DeliverOver(e){
    wx.showModal({
      title: '提示',
      content: '确认送货?',
      success: (res)=> {
        if (res.confirm) {
          this.SureOver(e.target.dataset.id)
        } else if (res.cancel) {
        }
      }
    })
  },
  SureOver(ID){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + "/page/pswc.do",
      data: {
        id: ID
      },
      method: 'Get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Set-Cookie': 'sessionToken=' + app.globalData.session
      }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.GetOrderList()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/attention.png',
            title: '提交失败!'
          })
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
  //上拉刷新
  onPullDownRefresh() {
    this.GetOrderList();
  },
  //获取订单
  GetOrderList(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + "/page/selectapply1.do",
      data: {
        id: app.globalData.userId
      },
      method: 'Get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Set-Cookie': 'sessionToken=' + app.globalData.session
      }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            OrderList: res.data.apply
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
          break
        case 0:
          wx.hideLoading()
          wx.stopPullDownRefresh()
          wx.showToast({
            image: '../../images/attention.png',
            title: '获取失败!'
          })
          break
        default:
          wx.hideLoading()
          wx.stopPullDownRefresh()
          wx.showToast({
            image: '../../images/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        image: '../../images/attention.png',
        title: '服务器繁忙！'
      });
    })
  }

})