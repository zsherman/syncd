Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this);

    // Note: most of this logic *CAN NOT* be put in catch block of the parse method
    // because new models when instantiated will not run through the code

  	var songs = new Syncd.Collections.Songs({});
    songs.length = 0;
    songs.parent = this;  
    this.set("songs", songs);

    // Mark as unfetched
    this.set("fetched", false);

    // Initialize faye subscriber
    var channelName = 'songs'+this.id;
    new BackboneSync.RailsFayeSubscriber(this.get("songs"), {
        channel: channelName, // Set to Rails model.class.table_name, or override Model.faye_channel
        client: faye
    });

    // Check to make sure that collection has been fetched
    // and populated with data on an add call (cannot be done
    // with a remove call). Need to think of a way to update the count
    // or fetch before a remove call from faye
    this.get("songs").on("add", this.isFetched);
  },

  urlRoot: '/playlists',

  parse: function(response) {
    var attrs = {};
    var _self = this;
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

    // If models have already been initialized, this should work
    try {
    	this.get("songs").reset(response.songs); // Repopulate songs collection
      this.get("fetched") ? "donothing" : this.set("fetched", true);
    	_.each(response, function(value, key) {
        if ((key != "songs") && (key != "subscribers")) {
    	 	 attrs[key] = value;
        } else if (key == 'subscribers') {
          buildSubscribers.apply(this, [value, key]);
        }
    	});
    // If not, do this (this will run when application first loads)
    } catch(e) {
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
    console.log(attrs);
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
  },

  isFetched: function() {
    if (this.get("fetched") === false) {
      this.fetch();
    }
  }

});