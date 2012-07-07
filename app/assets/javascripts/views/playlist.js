Syncd.Views.Playlist = Backbone.View.extend({
  tagName: "li",

  initialize: function() {
    _.bindAll(this, "render");
  },

  render: function () {
    this.$el.html(JST["playlists/playlist"]({playlist: this.model}));
    return this;
  },



});