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
      return JST[template](data);
    }
    _.extend(this, Backbone.Marionette.Application.prototype);

    this.Instances.PlaylistCollection = new Syncd.Collections.Playlists(data.playlist_collection, {parse: true});
  	this.Instances.InvitationCollection = new Syncd.Collections.Invites(data.invitation_collection);
    this.Instances.SearchCollection = new Syncd.Collections.Searches();

    router = new Syncd.Routers.Playlists({
      playlists: this.Instances.PlaylistCollection, 
      invitations: this.Instances.InvitationCollection,
      searches: this.Instances.SearchCollection
    });

    Backbone.history.start({pushState: true});
    router.navigate("/playlists");
  }
};

