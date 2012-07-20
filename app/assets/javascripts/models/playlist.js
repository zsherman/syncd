Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this);
  	this.initSongs();
  },

  urlRoot: '/playlists',

  initSongs: function() {
  	var songs = this.get("songs");
  	this.songs = new Syncd.Collections.Songs({collection: songs})
  },

  parse: function(response) {
  	this.songs = this.songs.reset(response.songs); // Repopulate songs collection
  	var attrs = {};
  	_.each(response, function(value, key) {
  		attrs[key] = value;
  	});
    this.songs.pid = response.playlist_id;
  	attrs.songs = this.songs;
    console.log(attrs);
  	return attrs;
  },

  droppableFunc: function( event, ui ) {
    // s_id = ID of song to be inserted into new playlist
    // old_pid = ID of playlist that song currently resides in
    var _self = this;
    var s_id = $(ui.helper[0]).data("id");
    var old_pid = $(ui.helper[0]).data("pid");

    // Create a new instance of the song model to be inserted into the desired playlist
    var songModel = this.collection.get(old_pid).get("songs").get(s_id).clone();

    // If the contents of the target playlist have not been fetched yet,
    // fetch them, add the new song model to the song collection, and save
    // it
    var addAndSave = function() { 
      _self.get("songs").add(songModel);
      songModel.save({}, {
        success: function(model, response){
          //_self.set({count: response.count});
        }
      });

    }

    if (this.get("songs") === null) {
      this.fetch({success: function(model) {
          addAndSave();
        }
      });
    } else {
      addAndSave();
    }
  }

});