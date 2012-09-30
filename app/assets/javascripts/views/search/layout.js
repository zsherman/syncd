Syncd.Layouts.Search = Backbone.Marionette.Layout.extend({
	initialize: function() {
		
	},

	template: "searches/layout",
	className: "search",
  	regions: {
    	artists: ".artists .items",
    	albums: ".albums .items",
    	playlists: ".playlists",
    	tracks: ".tracks"
	},

	onRender: function() {
		//$(".text .songs").html(this.collection.pagination.total_entries); // songs collection
		// $(".search .text span.artists").html(this.collection.artists.pagination.total_entries);
		// $(".search .text span.albums").html(this.collection.albums.pagination.total_entries);
		// console.log(this.collection);
	}

});