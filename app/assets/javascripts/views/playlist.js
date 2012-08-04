Syncd.Views.Playlist = Backbone.View.extend({
  tagName: "li",

  events: {
  	"dblclick": "editPlaylist"
  },

  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.vent.on("deletePL", this.deletePlaylist);
    this.model.get("songs").on("add", this.updateCount);
    this.model.get("songs").on("remove", this.updateCount);
  },

  render: function () {
    var self = this;
    this.$el.html(JST["playlists/playlist"]({playlist: this.model})).droppable({
      activeClass: "ui-state-active",
      hoverClass: "ui-state-hover",
      drop: self.model.droppableFunc
      });
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
    console.log(this.model);
    var id = this.model.id;
    this.$("span", this.$el).animate({
      left: '15px'
    }, 300 );
    this.$el.append("<div class='delete-button' data-id='"+id+"'></div>");
    $(".delete-button", this.$el).animate({
      left: '6px'
    }, 300 );
  },

  updateCount: function() {
    $(".num", this.el).html(this.model.get("songs").length);
  }

});