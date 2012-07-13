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
    var songsView = new Syncd.Views.SongsIndex({playlists: this.collection, vent: vent});
    $('#center').html(songsView.$el);

  
  },

  viewPlaylist: function(name) {
    //alert(name);
  }


}); 
