window.Syncd = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function(data) {
  	this.playlists = new Syncd.Collections.Playlists(data.collection);
  	router = new Syncd.Routers.Playlists({collection: this.playlists});
    Backbone.history.start({pushState: true});
  }
};
