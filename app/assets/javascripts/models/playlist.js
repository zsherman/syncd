Syncd.Models.Playlist = Backbone.Model.extend({
  
  initialize: function() {
    _.bindAll(this);
    var _self = this;

    // Note: most of this logic *CAN NOT* be put in catch block of the parse method
    // because new models when instantiated will not run through the code

    var songs = new Syncd.Collections.Songs({});
    songs.length = 0;
    songs.parent = this;  

    this.set({
      songs: songs,
      fetched: false
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
      if (!_self.get("fetched")) {
        _self.fetch();
      }
      // If a soundObject_id does not exist on the model, then run initSongs
      if (!model.soundObject_id) {
        model.initSongs();
      }
    });
  },

  urlRoot: '/playlists',

  parse: function(response) {
    var _self = this;
    var attrs = {};
    var buildSubscribers = function(value, key) {
      // Iterate through json and construct array of subscriber models
      var subscriber = [];
      _.each(value, function(value, key) {
        subscriber[key] = new Syncd.Models.Subscriber({uid: value.uid});     
      });

      // Initialize new subscriber collection with subscriber model array
      var subscribers = new Syncd.Collections.Subscribers(subscriber); 
      subscribers.parent = _self;
      attrs['subscribers'] = subscribers;
    }

    // If playlist is not new, then update it
    if (!this.isNew()) {
      this.get("songs").reset(response.songs); // Repopulate songs collection
      this.get("fetched") ? "donothing" : this.set("fetched", true);
    	_.each(response, function(value, key) {
        if ((key != "songs") && (key != "subscribers")) {
    	 	 attrs[key] = value;
        } else if (key == 'subscribers') {
          buildSubscribers.apply(this, [value, key]);
        }
    	});
    } else {
      // Do not load in song info, just set it to null
      // Load in subscriber info and create a nested collection
      _.each(response, function(value, key) {
        if (key == "subscribers") {
          buildSubscribers.apply(this, [value, key]);
        } else {
          attrs[key] = value;
        }
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

    // If the contents of the target playlist have not been fetched yet,
    // fetch them, add the new song model to the song collection, and save
    // it
    var addAndSave = function() { 
      _self.get("songs").add(songModel);
      songModel.save({}, {
        success: function(model, response){
          songModel.initSongs();
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