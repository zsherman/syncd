window.Syncd = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function(data) {
    _.extend(this, Backbone.Marionette.Application.prototype);
  	collection = new Syncd.Collections.Playlists(data.collection);
  	router = new Syncd.Routers.Playlists({collection: collection});
    Backbone.history.start({pushState: true});
    router.navigate("/playlists");
  }
};

