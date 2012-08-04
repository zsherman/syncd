Syncd.Collections.Songs = Backbone.Collection.extend({ 
	initialize: function(options) {
	},

  model: Syncd.Models.Song, 

  url: function() {
    return '/playlists/' + this.parent.id + '/songs';
  }
});