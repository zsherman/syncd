Syncd.Collections.Songs = Backbone.Collection.extend({ 
	initialize: function(options) {
		_.bindAll(this);
	},

	model: Syncd.Models.Song, 

	url: function() {
		return '/playlists/' + this.parent.id + '/songs';
  	},

  	initSongs: function() {
  		_.each(this.models, function(model) {
  			model.initSong();
  		});
  	}
});