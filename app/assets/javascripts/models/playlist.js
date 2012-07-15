Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this);
  	this.initSongs();
  },

  urlRoot: '/playlists',

  initSongs: function() {
  	var songs = this.get("songs");
  	this.songs = new Syncd.Collections.Songs({collection: songs, playlist: this.id})
  },

  parse: function(response) {
  	this.songs = this.songs.reset(response.songs); // Repopulate songs collection
  	var attrs = {};
  	_.each(response, function(value, key) {
  		attrs[key] = value;
  	});
    this.songs.pid = response.playlist_id;
  	attrs.songs = this.songs;
  	return attrs;
  },

  dropFunc: function( event, ui ) {
    var _self = this;
    var s_id = $(ui.helper[0]).data("id");
    var old_pid = $(ui.helper[0]).data("pid");
    var playlistCollection = this.collection;
    var songModel = playlistCollection.get(old_pid).get("songs").get(s_id).clone();
    var songCollection;

    if (playlistCollection.get(this).get("songs") === null) {
      playlistCollection.get(this).fetch({success: function(model) {
          songCollection = _self.get("songs");
          songCollection.add(songModel);
          songModel.save();
        }
      });
    } else {
      songCollection = playlistCollection.get(this).get("songs");
      songCollection.add(songModel);
      songModel.save();
    }
  }

});