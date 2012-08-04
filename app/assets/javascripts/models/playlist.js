Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this);
    //var friends = new Syncd.Collections.Friends({});  
  	var songs = new Syncd.Collections.Songs({});
    songs.length = 0;
    songs.parent = this;  
    //this.set("friends", songs);
    this.set("songs", songs);
  },

  urlRoot: '/playlists',

  parse: function(response) {
  	this.get("songs").reset(response.songs); // Repopulate songs collection
  	//songs.pid = response.playlist_id;
    var attrs = {};
  	_.each(response, function(value, key) {
      if (key != "songs") {
  	 	 attrs[key] = value;
      }
  	});
  	//attrs.songs = songs;
    //console.log(attrs);
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

    if (this.get("songs").length === 0) {
      this.fetch({success: function(model) {
          addAndSave();
        }
      });
    } else {
      addAndSave();
    }
  }

});