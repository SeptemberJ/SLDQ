const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    userInfo: {},
    loadingHidden: true,
    tempFilePaths:[],
    copyTempFilePaths: [],
    QCode:'',
    QCodeOld:'',
    status:'',
    Note:'',
    Canwork:false
  },

  onLoad: function (Options) {
    this.setData({
      id: Options.id,
      QCodeOld: Options.QCode,
      status: Options.status,
    })
    
  },

  //选择图片
  ChooseImage: function(){
    let temp = this.data.tempFilePaths
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          //tempFilePaths: res.tempFilePaths
          tempFilePaths: temp.concat(res.tempFilePaths),
          copyTempFilePaths: temp.concat(res.tempFilePaths)
        })
        console.log(this.data.tempFilePaths)
      }
    })
  },
  //删除图片
  DeleteImg: function(e){
    let IDX = e.currentTarget.dataset.idx
    let AfterSource = this.data.tempFilePaths
    AfterSource.splice(IDX,1)
    this.setData({
      tempFilePaths: AfterSource,
      copyTempFilePaths: AfterSource
    })
  },
  //扫码
  GetQCode: function(){
    wx.scanCode({
      success: (res) => {
        this.setData({
          QCode: res.result
        })
        console.log(res)
      }
    })
  },
  //手动输入二维码
  ChangeQCode: function(e){
    this.setData({
      QCode: e.detail.value
    })
  },
  //服务反馈
  ChangeNote: function(e){
    this.setData({
      Note: e.detail.value
    })
  },
  //提交
  SumitInfo: function(){
    console.log('code-------')
    console.log(this.data.QCodeOld)
    // if (this.data.QCodeOld != 'null'){
    //   if (this.data.QCode != this.data.QCodeOld) {
    //     wx.showToast({
    //       image: '/images/attention.png',
    //       title: '二维码不一致！'
    //     });
    //     return false
    //   }
    // }
    if (this.data.tempFilePaths.length<=0){
      wx.showToast({
        image: '../../images/attention.png',
        title: '请添加图片！'
      });
      return false
    }
    this.UploadImg()
  },
  UploadImg: function(){
    this.setData({
      loadingHidden: false,
      Canwork:true
    })
    wx.uploadFile({
      url: h.main + '/page/' + (this.data.status == 6 ? 'Insertimg' : 'Insertimg1') + '.do',//6 第一次上传 7第二次上传
      filePath: this.data.tempFilePaths.splice(0, 1)[0],
      name: 'file',
      formData: {
        id: this.data.id,
        QCode: this.data.QCode,
        Note: this.data.Note
      },
      header: {
        'content-type': 'multipart/form-data',
      },
      success: (res) => {
        console.log('图片上传backInfo-----')
        console.log(res)
        console.log(this.data.Note)
        if (res.data == 1) {
          if (this.data.tempFilePaths.length > 0) {
            this.UploadImg()
          } else {
            this.setData({
              loadingHidden: true,
              //Canwork: true
            })
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
            
          }
        } else {
          this.setData({
            loadingHidden: true,
            Canwork: false,
            tempFilePaths:this.data.copyTempFilePaths
          })
          wx.showToast({
            image: '../../images/attention.png',
            title: '图片上传失败！'
          });
          return false
        }
      },
      fail: (res) => {
        console.log('图片上传失败backInfo-----')
        console.log(res)
        this.setData({
          loadingHidden: true,
          Canwork: false
        })
        return false
      },
      complete: (res) => {
      }
    })
  }

})