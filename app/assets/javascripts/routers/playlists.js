Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    '': 'index',
    'playlists/:name': 'viewPlaylist',
  },
  
  initialize: function(options) {
  	this.collection = options.collection;
  },
  
  index: function() {
    // Event aggregator
    var vent = _.extend({}, Backbone.Events);

    // Set up user-editable playlists
  	var userPlaylists = new Syncd.Views.PlaylistsIndex({collection: this.collection, router: this, vent: vent});
    $('.playlists ul').html(userPlaylists.render().$el);
    
    // Set up songs view
    // !!! Change this so that collection.fetch is called when setActive is called, do not load the objects with json when page is initially loaded, lazily load them instead
    var songsView = new Syncd.Views.SongsIndex({vent: vent});
    $('#center').html(songsView.render().$el);

  
  },

  viewPlaylist: function() {
  }


}); 

// !!! Change this so that when you click on a playlist
//it navigates to viewPlaylist with the function being called
//and it creates a new view (remember to use swapping router)
//for songsindex.