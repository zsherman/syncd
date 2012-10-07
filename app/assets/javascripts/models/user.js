Syncd.Models.User = Backbone.Model.extend({

	initialize: function() {
		var followers = new Syncd.Collections.Users({});
		followers.parent = this;
		var following = new Syncd.Collections.Users({});
		following.parent = this;
		var playlists = new Syncd.Collections.Playlists({});
		playlists.parent = this;
		this.set({
			"followers": followers,
			"following": following,
			"playlists": playlists
		});

	},

	parse: function(response) {
		var _self = this;
	    var attrs = {};

	    if (true /*!this.isNew()*/) {
	    	_.each(response, function(value, key) {
		        if ((key != "playlists") && (key != "followers") && (key != "following")) {
		    	 	  attrs[key] = value;
		        }
	    	});
	      this.get("playlists").reset(response.playlists);
	      this.get("followers").reset(response.following);
	      this.get("following").reset(response.following);
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