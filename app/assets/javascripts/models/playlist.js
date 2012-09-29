Syncd.Models.Playlist = Backbone.Model.extend({
  
  initialize: function() {
    _.bindAll(this);
    var _self = this;

    // Set the defaults when initialized
    var songs = new Syncd.Collections.Songs({});
        songs.length = 0;
        songs.parent = this; 
    var subscribers = new Syncd.Collections.Subscribers({}); 
        subscribers.parent = this;
    var tags = new Syncd.Collections.Tags({});
        tags.parent = this;
    this.set ({ 
      "songs" : songs,
      "subscribers" : subscribers,
      "tags" : tags,
      "fetched" : false,
    });

    // Initialize faye subscriber
    new BackboneSync.RailsFayeSubscriber(this.get("songs"), {
        channel: 'songs'+this.id,
        client: faye
    });

    // Add a listener 
    this.get("songs").on("add", function(model) {
      // When a song is added to a playlist through faye, make sure that the playlist collection
      // has been fetched. If the playlist is not fetched, a song will be added to an empty collection
      _self.assureFetched();
      if (!model.soundObject_id) {
        model.initSong();
      }
    });
  },

  urlRoot: '/playlists',

  parse: function(response) {
    var _self = this;
    var attrs = {};
    var subscribers = [];

    if (!this.isNew()) {
    	_.each(response, function(value, key) {
        if ((key != "songs") && (key != "pending") && (key != "subscribed") && (key != "tags")) {
    	 	  attrs[key] = value;
        } else if ((key == 'pending') || (key == "subscribed")) {
          // Iterate through json and construct array of subscriber objects
          var status = (key == "subscribed") ? "accepted" : "pending";
          _.each(value, function(value, key) {
            subscribers.push({uid: value.uid, name: value.name, status: status});     
          });
        }
    	});
      this.get("subscribers").reset(subscribers);
      this.get("songs").reset(response.songs).initSongs(); // Repopulate songs collection
      this.get("tags").reset(response.tags);
      this.get("fetched") ? "donothing" : this.set("fetched", true);
    } else {
      _.each(response, function(value, key) {
          attrs[key] = value;
      });
    }
    return attrs;
  },

  droppableFunc: function( event, ui ) {
    var _self = this;
    var s_id = $(ui.helper[0]).data("id");
    var old_pid = $(ui.helper[0]).data("pid");

    // Create a new instance of the song model to be inserted into the desired playlist
    var songModel = this.collection.get(old_pid).get("songs").get(s_id).clone();

    // Assure that the playlist has been fetched and add + save the model
    this.assureFetched(function() { 
      _self.get("songs").add(songModel);
      songModel.save();
    });
  },

  // % Params: (function)
  // % If the playlist has not been fetched, then do so and run the function (if provided). 
  //   If the playlist has already been fetched, still run the function. 
  assureFetched: function(func) {
    if (this.get("fetched") == false) {
      this.fetch({success: function(model) {
          if (typeof func == "function") { 
            func(); 
          }
        }
      });
    } else {
      if (typeof func == "function") {
        func(); 
      } 
    }
  }
});