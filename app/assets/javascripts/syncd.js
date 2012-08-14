window.Syncd = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Instances: {},

  initialize: function(data) {
    // Override render function to allow JST templates
    Backbone.Marionette.Renderer.render = function(template, data){
      if (!JST[template]) throw "Template '" + template + "' not found!";
      console.log(data);
      return JST[template](data);
    }
    _.extend(this, Backbone.Marionette.Application.prototype);

    this.Instances.PlaylistCollection = new Syncd.Collections.Playlists(data.playlist_collection, {parse: true});
  	this.Instances.InvitationCollection = new Syncd.Collections.Invites(data.invitation_collection);

    router = new Syncd.Routers.Playlists({
      collection: this.Instances.PlaylistCollection, 
      invitations: this.Instances.InvitationCollection
    });

    Backbone.history.start({pushState: true});
    router.navigate("/playlists");
  }
};

