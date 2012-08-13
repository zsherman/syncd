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
  	
    playlist_collection = new Syncd.Collections.Playlists(data.playlist_collection, {parse: true});
  	invitation_collection = new Syncd.Collections.Invites(data.invitation_collection);

    router = new Syncd.Routers.Playlists({collection: playlist_collection, invitations: invitation_collection});
    Backbone.history.start({pushState: true});
    router.navigate("/playlists");
  }
};

