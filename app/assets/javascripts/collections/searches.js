Syncd.Collections.Searches = Backbone.Collection.extend({ 
	model: Syncd.Models.Song, 
	url: function() {
		var search_term = $('#top .search').val();
		var search_encoded = encodeURIComponent(search_term);
		return '/search/' + search_encoded;
		//dynamically construct to take in search params
	}
});