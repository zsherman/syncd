window.Syncd = new Backbone.Marionette.Application();

// Create empty objects that will be filled by constructors
Syncd.Models = {};
Syncd.Collections = {};
Syncd.Views = {};
Syncd.Routers = {};
Syncd.Instances = {};
Syncd.Layouts = {};

// Add initializer, will be called on Syncd.start(options), passing in options
Syncd.addInitializer(function(options){

  // Override render function to allow JST templates
  Backbone.Marionette.Renderer.render = function(template, data){
    if (!JST[template]) throw "Template '" + template + "' not found!";
    return JST[template](data);
  }

  // Need to grab data from the options [options are passed in when Syncd.start(options) is called]
  this.Instances.PlaylistCollection = new Syncd.Collections.Playlists(options.playlist_collection, {parse: true});
  this.Instances.InvitationCollection = new Syncd.Collections.Invites(options.invitation_collection);
  this.Instances.SearchCollection = new Syncd.Collections.Searches();

  // Set up regions
  Syncd.addRegions({
    centerRegion: "#center",
    rightRegion: "#right"
  });

  // Set up layouts
  Syncd.Layouts.Bottom = Backbone.Marionette.Layout.extend({
  	template: "player/layout",
  	
  	el: "#bottom",
  	
    regions: {
      nowplaying: ".now-playing",
      buttons: ".controls .buttons",
      progressbar: ".controls .progress-bar",
      volume: ".controls .audio"
    }
  });

  // Instantiate bottom layout and pass in views
  bottom_layout = new Syncd.Layouts.Bottom();
  bottom_layout.render();
  
  bottom_layout.nowplaying.show(new Syncd.Views.NowPlaying());
  bottom_layout.buttons.show(new Syncd.Views.Buttons());
  bottom_layout.progressbar.show(new Syncd.Views.ProgressBar());

  // Create new router
  router = new Syncd.Routers.Playlists({
    playlists: this.Instances.PlaylistCollection, 
    invitations: this.Instances.InvitationCollection,
    searches: this.Instances.SearchCollection
  });

  // Start the router and navigate to "/playlists"
  Backbone.history.start({pushState: true});
  router.navigate("/playlists");

});