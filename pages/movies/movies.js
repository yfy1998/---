// pages/movies/movies.js
const util = require("../../utils/util.js");
const app = getApp();
const INTHEATERS = 'in_theaters';
const COMING_SOON = 'coming_soon';
const TOP250 = 'top250';
const SEARCHLIST = 'searchlist';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in_theaters: {},
    coming_soon: {},
    top250: {},
    movieListShow: true,
    searchpanelShow: false,
    searchlist: {},
    pages: 0,
    searchurl: '',
    searchtotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getmovielistrequest(INTHEATERS, 3);
    this.getmovielistrequest(COMING_SOON, 3);
    this.getmovielistrequest(TOP250, 3);
  },

  getmovielistrequest(list_title, count, tag) {
    let requesturl = "";
    if (list_title === SEARCHLIST) {
      requesturl = app.globalData.httpdouban + '/v2/movie/search?q=' + tag;
      this.setData({
        searchurl: requesturl,
        pages: 1
      })
    } else {
      requesturl = app.globalData.httpdouban + '/v2/movie/' + list_title;
    }
    wx.request({
      url: requesturl,
      data: {
        start: 0,
        count: count
      },
      header: {
        "content-type": "json"
      },
      success: (res) => {
        console.log(res.data);
        this.getmovielistdata(res.data, list_title);
        wx.hideLoading();
      }
    })
  },

  getmovielistdata(data, list_title) {
    const arr = [];
    for (let i = 0; i < data.subjects.length; i++) {
      const currentmovie = data.subjects[i];
      if (currentmovie.title.length > 7) {
        var title = currentmovie.title.slice(0, 7) + "···";
      } else {
        title = currentmovie.title;
      }
      const movie = {
        id: currentmovie.id,
        title: title,
        imageurl: currentmovie.images.large,
        rating: currentmovie.rating,
        stars: util.getstarlist(currentmovie.rating.stars)
      }
      arr.push(movie);
    }
    this.setData({
      [list_title]: {
        title: data.title,
        list: arr
      },
      searchtotal: data.total
    });
  },

  navigatetomore(e) {
    const moreType = e.currentTarget.dataset.moreType;
    wx.navigateTo({
      url: 'more-movie/more-movie?Type=' + moreType,
    })
  },

  oninputFocus(e) {
    this.setData({
      movieListShow: false,
      searchpanelShow: true
    })
  },

  oninputConfirm(e) {
    wx.showLoading({
      title: '搜索中',
    });
    let tag = e.detail.value;
    if (tag === '') tag = '复仇者联盟4';
    this.getmovielistrequest(SEARCHLIST, 18, tag);
  },

  oncancle(e) {
    this.setData({
      movieListShow: true,
      searchpanelShow: false,
      searchlist: {},
      pages: 0,
      searchurl: ''
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.searchurl === '') return;
    if (this.data.pages * 18 >= this.data.searchtotal) {
      wx.showToast({
        title: '不要再刷了，没有更多了',
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    this.getsearchrequest();
  },

  getsearchrequest() {
    wx.request({
      url: this.data.searchurl,
      data: {
        start: this.data.pages * 18,
        count: 18
      },
      header: {
        "content-type": "json"
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        this.concatsearchlist(res.data);
        wx.hideLoading();
      }
    })
  },

  concatsearchlist(data) {
    const arr = [];
    for (let i = 0; i < data.subjects.length; i++) {
      const currentmovie = data.subjects[i];
      if (currentmovie.title.length > 7) {
        var title = currentmovie.title.slice(0, 7) + "···";
      } else {
        title = currentmovie.title;
      }
      const movie = {
        id: currentmovie.id,
        title: title,
        imageurl: currentmovie.images.large,
        rating: currentmovie.rating,
        stars: util.getstarlist(currentmovie.rating.stars)
      }
      arr.push(movie);
    }
    this.setData({
      searchlist: {
        title: data.title,
        list: this.data.searchlist.list.concat(arr)
      },
      pages: this.data.pages + 1
    });
  },

  onMoviedetail(e){
    console.log(e.currentTarget.dataset);
    const id=e.currentTarget.dataset.movieId;
    const stars=e.currentTarget.dataset.movieStars;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+id+'&stars='+stars,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})