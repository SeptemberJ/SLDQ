//app.js
import h from '/utils/url.js'
const AV = require('./utils/av-weapp.js');
const appId = "wxc13814cf8d4c5480";
const appKey = "8d26fc4a84bd14825bf78cc0a6e1ddf7";
var startTime=0;
var endTime=0;
AV.init({ 
	appId: "SgHcsYqoLaFTG0XDMD3Gtm0I-gzGzoHsz", 
	appKey: "xdv2nwjUK5waNglFoFXkQcxP",
});

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
     wx.login({
        success: function (a) {
          var code = a.code;
          console.log(code+"*******************")
          wx.getUserInfo({
            success: function (res) {
              var encryptedData = encodeURIComponent(res.encryptedData);
               var iv = res.iv;
              that.globalData.userInfo = res.userInfo
              that.globalData.code = code
              that.globalData.encryptedData = encryptedData
              that.globalData.iv = res.iv
              
            //Login(code,encryptedData,iv);
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
    // endTime=new Date().getTime()
  },
  globalData: {
    userId:'',
    userInfo: null,
    TabCur:0,
    _TabCur:0,
    code: "",
    encryptedData: "",
    iv: "",
    oppenid:'',
    userRole:'',
    // accountName:'',
    // sessionid:'',
    // SPname:''
  },

})

//Login-----
function  Login(code,encryptedData,iv){  
          console.log('login function---===');
          var app = getApp();
          console.log(app.globalData.userInfo);
          console.log(code)
          //请求服务器
          wx.request({
            url:  h.main+"/page/userInsertWsc.do",
            data: {
             code:code,
             realname:app.globalData.userInfo.nickName,
             head_img:app.globalData.userInfo.avatarUrl
            },
            
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
               'content-type': 'application/x-www-form-urlencoded' ,
                'Accept': 'application/json'
            }, // 设置请求的 header
            success: function (res) {
              console.log('========++++');
              // success
              console.log(res.data);
              app.globalData.oppenid=res.data.oppen_id;
            },
            fail: function (res) {
              // fail
                console.log(res);
            },
            complete: function (res) {
              // complete
                console.log(res);
            }
          })
  }

