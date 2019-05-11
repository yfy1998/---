// pages/movies/movie-detail/movie-detail.js
const app = getApp();
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id=options.id;
    const stars=options.stars;
    this.getmoviedetail(id,stars);
  },

  getmoviedetail(id,stars){
    wx.request({
      url: app.globalData.httpdouban + '/v2/movie/' + id,
      header: {
        "content-type": "json"
      },
      success: (res) => {
        console.log(res.data);
        this.getmoviedata(res.data,stars);
      }
    })
  },
  
  getmoviedata(data,stars){
    const movie={
      title: data.title,
      summary: data.summary,
      imageurl: data.image,
      alt_title: data.alt_title,
      rating: data.rating,
      stars: stars.split(',').map((item)=>{
        return Number(item);
      }),
      year: data.attrs.year.join('/'),
      duration: data.attrs.movie_duration ? data.attrs.movie_duration : '',
      cast: data.attrs.cast.slice(0,4).join('/'),
      type: data.attrs.movie_type ? data.attrs.movie_type.join('、') : '',
      country: data.attrs.country.join('/'),
      pubdate: data.attrs.pubdate? data.attrs.pubdate.join('/') : '',
      language: data.attrs.language? data.attrs.language.join('/') :'',
      director: data.attrs.director ? data.attrs.director.join('/') : '',
      // writer: data.attrs.writer.join('/'),
    }
    this.setData({
      movie: movie
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})