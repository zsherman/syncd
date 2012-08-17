Syncd.Models.Invite = Backbone.Model.extend({

	initialize: function() {
		_.bindAll(this);
	},

	addPlaylist: function() {
		var _self = this;
		this.set("status", "accepted");
		this.save();

		var playlist = new Syncd.Models.Playlist({id: this.get("playlist_id"), name: this.get("playlist_name")});
	    playlist.fetch({success: function(model) {
	          Syncd.Instances.PlaylistCollection.add(model);
	        }
	    });

	    // Remove invitation
	  	setTimeout(function () {
	      _self.destroy();
	    }, 1500);
	},


	urlRoot: function() { return '/playlists/'+this.get("playlist_id")+'/subscribers' }

});