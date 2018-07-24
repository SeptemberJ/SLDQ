const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    userInfo: {},
    userName: '',
    psd: '',
    role: 0,
    changeUserName: false,
    changePsd: false,
    ifRemember:false,
    loadingHidden: true,
  },

  onLoad: function () {
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo,
        nickName: userInfo.nickName,
      })
    }) 
    console.log('---------');
    console.log(app.globalData.userInfo);
  },
  onShow(){
    wx.getStorage({
      key: 'ifRemember',
      success: (res) => {
        if (res.data) {
          wx.getStorage({
            key: 'AccountInfo',
            success: (_res) => {
              this.setData({
                ifRemember: res.data,
                userName: _res.data.user,
                psd: _res.data.psd
              })
            }
          })
        }else{
          this.setData({
            userName: '',
            psd: '',
          })
        }
      }
    })
  },
  //记住密码
  RememberPsd: function (e) {
    let temp = this.data.ifRemember
    this.setData({
      ifRemember: !temp
    })
    wx.setStorage({
      key: "ifRemember",
      data: !temp
    })
  },
  //focus时改变border-color
  changeBorderColorUser: function (e) {
    const ifChange = !this.data.changeUserName
    this.setData({
      changeUserName: ifChange
    });
  },
  changeBorderPsd: function () {
    const ifChange = !this.data.changePsd
    this.setData({
      changePsd: ifChange
    });
  },
  //恢复border-color
  noamrlBorderColorUser: function () {
    const ifChange = !this.data.changeUserName
    this.setData({
      changeUserName: ifChange
    });
  },
  noamrlBorderColorPsd: function () {
    const ifChange = !this.data.changePsd
    this.setData({
      changePsd: ifChange
    });
  },
  //获取输入的姓名
  ChangeUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //获取输入的密码
  ChangePsd: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },
  // ChangePsdAgain: function (e) {
  //   this.setData({
  //     psdAgain: e.detail.value
  //   })
  // },

  // toSign: function () {
  //   wx.navigateTo({
  //     url: '../Sign/index'
  //   })
  // },

  loginIn: function () {
    var USER = this.data.userName
    var PSD = this.data.psd
    // var PSDAgain = this.data.psdAgain
    if (USER === "" || USER === null) {
      wx.showModal({
        title: '提示',
        content: '用户名不能为空!',
        confirmColor: '#7FC9B8',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return false;
    }
    if (PSD === "" || PSD === null) {
      wx.showModal({
        title: '提示',
        content: '密码不能为空!',
        confirmColor: '#7FC9B8',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {   
          }
        }
      });
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
        url:  h.main+"/page/login.do",
        data: {
        username:USER,
        password:PSD,
        //oppen_id: app.globalData.oppenid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
        'content-type': 'application/x-www-form-urlencoded' ,
            'Accept': 'application/json',
            'Set-Cookie':'sessionToken='+app.globalData.session
        }, // 设置请求的 header
    }).then((res)=> {
        console.log('login backinfor----');
        console.log(res.data);
        switch (res.data.result){
          case 1:
            app.globalData.userId = res.data.id
            app.globalData.userRole = res.data.ftype  //1安装    2送货
            //若为记住密码则保存账户信息，不然删除本地存储
            if (this.data.ifRemember){
              wx.setStorage({
                key: "AccountInfo",
                data: { 'user': USER, 'psd': PSD }
              })
            }else{
              wx.removeStorage({
                key: 'AccountInfo',
                success: (res)=> {
                  console.log(res.data)
                }
              })
            }
            wx.switchTab({
              url: '../OrderList/index',
            })
            // if (res.data.ftype == 1){
            //   wx.navigateTo({
            //     url: '../OrderList/index'
            //   })
            // }else{
            //   wx.navigateTo({
            //     url: '../Deliver/index'
            //   })
            // }
            wx.hideLoading()
            break
          case 2:
            wx.hideLoading()
            wx.showToast({
              image: '/images/attention.png',
              title: '密码错误！'
            })
            break
          case 0:
            wx.hideLoading()
            wx.showToast({
              image: '/images/attention.png',
              title: '用户不存在！'
            })
            break
          default:
            wx.hideLoading()
            wx.showToast({
              image: '../../images/attention.png',
              title: '服务器繁忙！'
            });
        }
    }).catch((res)=> {
        wx.hideLoading()
        wx.showToast({
          image: '../../images/attention.png',
          title: '服务器繁忙！'
        });
    })
  },

})