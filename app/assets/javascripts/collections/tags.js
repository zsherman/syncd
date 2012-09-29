Syncd.Collections.Tags = Backbone.Collection.extend({ 
	initialize: function() {
	},

	model: Syncd.Models.Tag, 

	url: function() {
		return '/playlists/' + this.parent.id + '/tags';
  	}
});