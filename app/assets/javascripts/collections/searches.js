Syncd.Collections.Searches = Backbone.Collection.extend({ 
	model: Syncd.Models.Song, 
	url: function() {
		return '';
		//dynamically construct to take in search params
	}
});