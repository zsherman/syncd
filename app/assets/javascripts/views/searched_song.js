Syncd.Views.SearchedSong = Backbone.Marionette.ItemView.extend({

  initialize: function() {
    _.bindAll(this);
    this.model.initSongsonce();
  },

  template: "searches/searched_song",

});