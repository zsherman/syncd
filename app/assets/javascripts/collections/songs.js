Syncd.Collections.Songs = Backbone.Collection.extend({ 
	initialize: function(options) {
		//this.pl_id = options.id;
		//console.log(this.pl_id);
	},

  model: Syncd.Models.Song, 
  url: '/playlists'
});