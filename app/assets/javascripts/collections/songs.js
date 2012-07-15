Syncd.Collections.Songs = Backbone.Collection.extend({ 
	initialize: function(options) {
		//console.log(options);
		this.p_id = options.playlist;
	},

  model: Syncd.Models.Song, 
  url: function() {
    return '/playlists/' + this.p_id + '/songs';
  }
});