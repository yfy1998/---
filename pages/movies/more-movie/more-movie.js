// pages/movies/more-movie/more-movie.js
const util = require("../../../utils/util.js")
const app = getApp();

Page({

  data: {
    Type: "",
    requestUrl: "",
    list: [],
    totalmovies: 0,
    total: 0
  },

  onLoad: function(options) {
    console.log(options.Type);
    this.setData({
      Type: options.Type
    })
    let requestUrl = "";
    switch (options.Type) {
      case "正在上映的电影-北京":
        requestUrl = app.globalData.httpdouban + "/v2/movie/in_theaters";
        break;
      case "即将上映的电影":
        requestUrl = app.globalData.httpdouban + "/v2/movie/coming_soon";
        break;
      case "豆瓣电影Top250":
        requestUrl = app.globalData.httpdouban + "/v2/movie/top250";
        break;
      default:
        break;
    }
    this.setData({
      requestUrl: requestUrl
    })
    this.getmovierequest();
  },

  getmovierequest() {
    wx.request({
      url: this.data.requestUrl + "?start=" + this.data.totalmovies + "&count=18",
      header: {
        "content-type": "json"
      },
      success: (res) => {
        console.log(res.data);
        this.getmovielistdata(res.data);
        wx.hideLoading();
      }
    })
  },

  getmovielistdata(data) {
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
      list: this.data.list.concat(arr),
      totalmovies: this.data.totalmovies + data.subjects.length,
      total: data.total
    });
  },

  backtotop(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.Type
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log(111);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("加载更多");
    if (this.data.totalmovies >= this.data.total) {
      wx.showToast({
        title: '不要再刷了，没有更多了',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      this.getmovierequest();
    }
  },

  onMoviedetail(e) {
    console.log(e.currentTarget.dataset);
    const id = e.currentTarget.dataset.movieId;
    const stars = e.currentTarget.dataset.movieStars;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id + '&stars=' + stars,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})