Syncd.Models.User = Backbone.Model.extend({

	initialize: function() {
		_.bindAll(this);
    	var _self = this;
		// var followers = new Syncd.Collections.Users({});
		// followers.parent = this;
		// var following = new Syncd.Collections.Users({});
		// following.parent = this;
		var playlists = new Syncd.Collections.Playlists({});
		playlists.parent = this;
		var plays = new Syncd.Collections.Songs({});
		this.set({
			// "followers": followers,
			// "following": following,
			"playlists": playlists,
			"plays": plays
		});

	},

	parse: function(response) {
		var _self = this;
	    var attrs = {};

	    if (true /*!this.isNew()*/) {
	    	_.each(response, function(value, key) {
		        if ((key != "playlists") && (key != "plays")) {
		    	 	  attrs[key] = value;
		        }
	    	});
	      this.get("playlists").reset(response.playlists);
	      // this.get("followers").reset(response.following);
	      // this.get("following").reset(response.following);
	      this.get("plays").reset(response.plays);
	      this.get("fetched") ? "donothing" : this.set("fetched", true);
	    } else {
	      _.each(response, function(value, key) {
	          attrs[key] = value;
	      });
	    }
	    return attrs;
	},

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
  	},

	urlRoot: "/users"

});