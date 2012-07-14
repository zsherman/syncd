Syncd.Collections.Songs = Backbone.Collection.extend({ 
	initialize: function(options) {
		//console.log(this);
		//this.pl_id = options.id;
		//console.log(this.pl_id);
	},

  model: Syncd.Models.Song, 
  url: '/playlists'
});