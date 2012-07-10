Syncd.Views.Playlist = Backbone.View.extend({
  tagName: "li",

  events: {
  	"dblclick": "editPlaylist"
  },

  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.vent.on("deletePL", this.deletePlaylist);
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
  	var newName = $("input", this.el).val();
  	this.model.set("name", newName);
  	this.model.save();
  	this.render();
  	$(document).not(document.getElementById('editPlaylistName')).unbind("click");
  },

  deletePlaylist: function() {
    var id = this.model.id;
    this.$("span", this.$el).animate({
      left: '15px'
    }, 300 );
    this.$el.append("<div class='delete-button' data-id='"+id+"'></div>");
    $(".delete-button", this.$el).animate({
      left: '6px'
    }, 300 );
  }


});