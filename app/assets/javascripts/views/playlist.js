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
    var self = this;
    this.$el.html(JST["playlists/playlist"]({playlist: this.model})).droppable({
      activeClass: "ui-state-hover",
      hoverClass: "ui-state-active",
      drop: function( event, ui ) {
        //var playlistid = $(this).children().data("id");
        var song_id = $(ui.helper[0]).data("id");
        var old_playlist_id = $(ui.helper[0]).data("pid");

        //console.log(playlistid);
        //console.log(event);
        //console.log(ui);
        //console.log(songid);

        var playlistCollection = self.model.collection;
        var songModel = playlistCollection.get(old_playlist_id).get("songs").get(song_id);
        var songCollection;

        if (playlistCollection.get(self.model).get("songs") === null) {
          playlistCollection.get(self.model).fetch({success: function(model) {
              songCollection = model.get("songs");
              songCollection.add(songModel);
            }
          });
        } else {
          songCollection = playlistCollection.get(self.model).get("songs");
          songCollection.add(songModel);
        }
        //console.log(playlistCollection.get(playlistid));

      }
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