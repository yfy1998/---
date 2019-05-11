// pages/posts/post-detail/post-detail.js
const postdata = require('../../../data/postData.js')
const app = getApp();
Page({

  data: {
    collected: false,
    curnews: {}
  },

  onLoad: function(options) {
    this.setData({
      currentnewsId: options.newsId,
    })
    this.getnewsrequest();


    //设置文章订阅缓存
    var newscollection = wx.getStorageSync("news_collection");
    if (newscollection) {
      var newcollected = newscollection[options.newsId];
      if (newcollected) {
        this.setData({
          collected: newcollected
        })
      } else {
        this.setData({
          collected: false
        })
      }
    } else {
      var newscollection = {};
      newscollection[options.newsId] = false;
      wx.setStorageSync("news_collection", newscollection);
      this.setData({
        collected: false
      })
    }
  },

  getnewsrequest() {
    wx.request({
      url: app.globalData.httpnews + 'SearchNews?id='+ this.data.currentnewsId,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        this.setData({
          curnews: res.data[0]
        })
      }
    })
  },




  ontapcollect(e) {
    var newcollected = !this.data.collected;
    var newscollection = wx.getStorageSync("news_collection");
    newscollection[this.data.currentnewsId] = newcollected;
    wx.setStorageSync("news_collection", newscollection);
    this.setData({
      collected: newcollected
    })
    wx.showToast({
      title: newcollected?'收藏成功':'取消收藏成功',
      icon: 'success'
    })
  },

  
  onShareAppMessage: function () {

  }
})