Syncd.Views.SearchedSong = Backbone.Marionette.ItemView.extend({

  initialize: function() {
    _.bindAll(this);
    //this.model.initSongsonce();
  },

  template: "searches/searched_song",

  events: {
  	"click.searched_song .play_search": "clickPlay",
  	"click.searched_song .stop_search": "clickStop",
  },

  clickPlay: function() {
  	this.model.play();
  },

  clickStop: function() {
  	this.model.stop();
  },

  play: function() {

  },

  stop: function() {

  }

});