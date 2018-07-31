const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    userInfo: {},
    loadingHidden: true,
    tempFilePaths: [],
    copyTempFilePaths: [],
    // QCode: '',
    // QCodeOld: '',
    // status: '',
    // Note: '',
    Canwork: false
  },

  onLoad: function (Options) {
    this.setData({
      id: Options.id,
      // QCodeOld: Options.QCode,
      // status: Options.status,
    })

  },

  //选择图片
  ChooseImage: function () {
    let temp = this.data.tempFilePaths
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res) => {
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
  DeleteImg: function (e) {
    let IDX = e.currentTarget.dataset.idx
    let AfterSource = this.data.tempFilePaths
    AfterSource.splice(IDX, 1)
    this.setData({
      tempFilePaths: AfterSource,
      copyTempFilePaths: AfterSource
    })
  },
  //扫码
  GetQCode: function () {
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
  ChangeQCode: function (e) {
    this.setData({
      QCode: e.detail.value
    })
  },
  //服务反馈
  ChangeNote: function (e) {
    this.setData({
      Note: e.detail.value
    })
  },
  //提交
  SumitInfo: function () {
    if (this.data.tempFilePaths.length <= 0) {
      wx.showToast({
        image: '../../images/attention.png',
        title: '请添加图片！'
      });
      return false
    }
    this.UploadImg()
  },
  UploadImg: function () {
    this.setData({
      loadingHidden: false,
      Canwork: true
    })
    wx.uploadFile({
      url: h.main + '/page/psimage.do',
      filePath: this.data.tempFilePaths.splice(0, 1)[0],
      name: 'file',
      formData: {
        id: this.data.id,
        // QCode: this.data.QCode,
        // Note: this.data.Note
      },
      header: {
        'content-type': 'multipart/form-data',
      },
      success: (res) => {
        console.log('图片上传backInfo-----')
        console.log(res)
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
            tempFilePaths: this.data.copyTempFilePaths
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