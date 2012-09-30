Syncd.Collections.Searches = Backbone.Paginator.requestPager.extend({

	initialize: function(options) {
        this.input = options.input;
	    this.artists = new Syncd.Collections.Artists({});
    	this.albums = new Syncd.Collections.Albums({});
    	this.playlists = new Syncd.Collections.Playlists({});
	},

	model: Syncd.Models.Song,

	paginator_core: {
        // the type of the request (GET by default)
        type: 'GET',

        // the type of reply (jsonp by default)
        dataType: 'json',

        // the URL (or base URL) for the service
    	url: function() {
            return 'http://localhost:3000/search/'+this.input+'.json?'
        }
    },

	paginator_ui: {
        // the lowest page index your API allows to be accessed
        firstPage: 0,

        // which page should the paginator start from 
        // (also, the actual page the paginator is on)
        currentPage: 0,

        // how many items per page should be shown
        perPage: 3,

        // a default number of total pages to query in case the API or 
        // service you are using does not support providing the total 
        // number of pages for us.
        // 10 as a default in case your service doesn't return the total
        totalPages: 10
    },

    server_api: {
        // the query field in the request
        '$filter': '',

        // number of items to return per request/page
        '$top': function() { return this.perPage },

        // how many results the request should skip ahead to
        // customize as needed. For the Netflix API, skipping ahead based on
        // page * number of results per page was necessary.
        '$skip': function() { return this.currentPage * this.perPage },

        // field to sort by
        '$orderby': 'ReleaseYear',

        // what format would you like to request results in?
        '$format': 'json',

        // custom parameters
        '$inlinecount': 'allpages',
        '$callback': 'callback'                                     
    },

    parse: function (response) {
        // Reset tags, artists, and albums collection with items
        var songs = response.songs.items;
        this.artists.reset(response.artists.items);
        this.albums.reset(response.albums.items);

        // Insert pagination information
        songs.pagination = response.songs.pagination;
        this.artists.pagination = response.artists.pagination;
        this.albums.pagination = response.albums.pagination

        return songs;
    },

    initSongs: function() {
        _.each(this.models, function(model) {
            model.initSong();
        });
    }

});