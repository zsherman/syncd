Syncd.Collections.Searches = Backbone.Collection.extend({ 
	model: Syncd.Models.Song, 
	url: function() {
		return '/beach%20house/song/search';
		//dynamically construct to take in search params
	}
});