Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    '': 'index'
  },
  
  initialize: function(options) {
  	this.collection = options.collection;
  },
  
  index: function() {
    // Set user-editable playlists
  	var userPlaylists = new Syncd.Views.PlaylistsIndex({collection: this.collection});
    $('.playlists ul').html(userPlaylists.render().$el);

    // Set Music playlist
    var musicPlaylist = new Syncd.View.Playlist();

    // Note: Change this to a composite view to take care of setting and removing class="active"
  }


});