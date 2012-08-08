window.Syncd = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function(data) {
    // Override render function to allow JST templates
    Backbone.Marionette.Renderer.render = function(template, data){
      if (!JST[template]) throw "Template '" + template + "' not found!";
      console.log(data);
      return JST[template](data);
    }
    _.extend(this, Backbone.Marionette.Application.prototype);
  	collection = new Syncd.Collections.Playlists(data.collection, {parse: true});
  	router = new Syncd.Routers.Playlists({collection: collection});
    Backbone.history.start({pushState: true});
    router.navigate("/playlists");
  }
};

