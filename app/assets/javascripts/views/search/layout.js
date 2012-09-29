Syncd.Layouts.Search = Backbone.Marionette.Layout.extend({
	initialize: function() {
		
	},

	template: "searches/layout",
	className: "search",
  	regions: {
    	artists: ".artists",
    	albums: ".albums",
    	playlists: ".playlists",
    	tracks: ".tracks"
	}
});