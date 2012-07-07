Syncd.Views.Playlist = Backbone.View.extend({
  tagName: "li",

  events: {
  	"dblclick": "editPlaylist"
  },

  initialize: function() {
    _.bindAll(this);
  },

  render: function () {
    this.$el.html(JST["playlists/playlist"]({playlist: this.model}));
    return this;
  },

  editPlaylist: function(eventName) {
  	this.$el.html(JST["playlists/new_playlist"]({playlist: this.model}));
    $(document).not(document.getElementById('editPlaylistName')).on("click", this.saveName);
  },

  saveName: function() {
  	this.model.set("name", $("input", this.el).val());
  	this.render();
  	$(document).not(document.getElementById('editPlaylistName')).unbind("click");
  }


});