Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    'playlists': 'index',
    '': 'index',
    'playlists/:name': 'viewPlaylist',
  },
  
  initialize: function(options) {
  	this.collection = options.collection;
    new BackboneSync.RailsFayeSubscriber(this.collection, {
      channel: 'playlists', // Set to Rails model.class.table_name, or override Model.faye_channel
      client: faye
    });
  },
  
  index: function() {
    // Event aggregator
    var vent = _.extend({}, Backbone.Events);

    // Set up user-editable playlists
  	var userPlaylists = new Syncd.Views.PlaylistsIndex({collection: this.collection, router: this, vent: vent});
    $('.playlists ul').html(userPlaylists.render().$el);
    
    // Set up regions
    Syncd.addRegions({
      centerRegion: "#center",
      rightRegion: "#right"
    });

    // Syncd.centerRegion.on("view:show", function(view){
    //   console.log(view);
    // });

  
  },

  viewPlaylist: function(name) {
    //alert(name);
  }


}); 
