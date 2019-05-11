// pages/posts/posts.js
const postdata = require('../../data/postData.js')
const app = getApp();
const utils=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishome: true,
    postlist: [],
    swiperlist: [],
    pages: 0,
    colectnews: []
  },

  toPostdetail(e) {
    let newsId = e.currentTarget.dataset.newsId;
    const inpostlistindex = utils.getindex(this.data.postlist, newsId);
    if(inpostlistindex!==false){
      let npostlist = JSON.parse(JSON.stringify(this.data.postlist));
      npostlist[inpostlistindex].reading++;
      this.setData({
        postlist: npostlist
      })
      // this.setData({
      //   [postlist[inpostlistindex].reading]: this.data.postlist[inpostlistindex].reading+1
      // })
    };
    wx.navigateTo({
      url: 'post-detail/post-detail?newsId=' + newsId,
    })
  },

  swipernavigate(e) {
    let newsId = e.target.dataset.newsId;
    wx.navigateTo({
      url: 'post-detail/post-detail?newsId=' + newsId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getnewsrequest();
    this.getswiperrequest();
    // this.setData({
    //   postlist:postdata.postlist
    // })
  },

  getnewsrequest(pulldown) {
    wx.request({
      url: app.globalData.httpnews + 'GetNews?' + 'offset=' + (3+this.data.pages * 5) + '&rows=5',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        this.getnewslist(res.data, pulldown);
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })
  },

  getnewslist(data, pulldown) {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      let currentnews = data[i];
      let title = currentnews.title;
      if (currentnews.title.length > 40) {
        title = currentnews.title.slice(0, 40) + '···';
      }
      const news = {
        newsId: currentnews.newsId,
        title: title,
        imageUrl: currentnews.imageUrl,
        date: currentnews.addTime,
        content: currentnews.newtext,
        summary: currentnews.newtext.slice(0, 100) + '···',
        reading: currentnews.reading
      }
      arr.push(news);
    }
    if (pulldown) {
      this.setData({
        postlist: arr,
        pages: (this.data.pages + 1) % 25
      })
    } else {
      this.setData({
        postlist: this.data.postlist.concat(arr),
        pages: (this.data.pages + 1) % 25
      })
    }
  },

  getswiperrequest() {
    wx.request({
      url: app.globalData.httpnews + 'GetNews?offset=0&rows=3',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        this.getswiperlist(res.data);
      }
    })
  },

  getswiperlist(data){
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      let currentnews = data[i];
      let title = currentnews.title;
      if (currentnews.title.length > 40) {
        title = currentnews.title.slice(0, 40) + '···';
      }
      const news = {
        newsId: currentnews.newsId,
        title: title,
        imageUrl: currentnews.imageUrl,
        date: currentnews.addTime,
        content: currentnews.newtext,
        summary: currentnews.newtext.slice(0, 100) + '···',
        reading: currentnews.reading
      }
      arr.push(news);
    }
    this.setData({
      swiperlist: arr
    })
  },

  onChangetocolect(e) {
    this.setData({
      ishome: false
    })
    const newscolect = wx.getStorageSync('news_collection');
    const arr = [];
    for (var id in newscolect) {
      if (newscolect[id] === true) {
        arr.push(id);
      }
    }
    if (arr.length===0) {
      this.setData({
        colectnews: []
      })
      return;
    } 
    else {
      this.getcolectnewsrequest(arr);
    }
  },

  getcolectnewsrequest(arr) {
    wx.request({
      url: app.globalData.httpnews + 'SearchNews?id=' + arr,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        this.getcolectnewslist(res.data);
      }
    })
  },

  getcolectnewslist(data) {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      let currentnews = data[i];
      let title = currentnews.title;
      if (currentnews.title.length > 40) {
        title = currentnews.title.slice(0, 40) + '···';
      }
      const news = {
        newsId: currentnews.newsId,
        title: title,
        imageUrl: currentnews.imageUrl,
        date: currentnews.addTime,
        content: currentnews.newtext,
        summary: currentnews.newtext.slice(0, 100) + '···',
        reading: currentnews.reading
      }
      arr.push(news);
    }
    this.setData({
      colectnews: arr
    })
  },

  onChangetohome(e) {
    this.setData({
      ishome: true,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(!this.data.ishome)
    this.onChangetocolect();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log(111);
    wx.showNavigationBarLoading();
    this.getnewsrequest(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.ishome) return;
    if (this.data.ishome) {
      wx.showLoading({
        title: '加载中',
      })
      this.getnewsrequest();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  backtotop(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
})