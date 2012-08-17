Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    'playlists': 'index',
    '': 'index',
    'playlists/:name': 'viewPlaylist',
  },
  
  initialize: function(options) {
  	this.playlists = options.playlists;
    this.invitations = options.invitations;
    this.searches = options.searches;
    var uid = localStorage.getItem("uid").replace(/"/g, '');
    new BackboneSync.RailsFayeSubscriber(this.playlists, {
      channel: uid+'/playlists', // Set to Rails model.class.table_name, or override Model.faye_channel
      client: faye
    });
  },
  
  index: function() {
    var _self = this;

    // Event aggregator
    var vent = _.extend({}, Backbone.Events);

    // Set up user-editable playlists
  	var userPlaylists = new Syncd.Views.PlaylistsIndex({collection: this.playlists, router: this, vent: vent});
    $('.playlists ul').html(userPlaylists.render().$el);
    
    // Set up regions
    Syncd.addRegions({
      centerRegion: "#center",
      rightRegion: "#right"
    });

    // Render invitations
    var invitationsView = new Syncd.Views.InvitesIndex({collection: this.invitations});
    $('#top .invites-container .content').html(invitationsView.render().$el);

    $('#top .invites-button').toggle(function() {
      $('#top .invites-container').fadeIn(400);
    }, function() {
      $('#top .invites-container').fadeOut(400);
    });

    var keypressCallback = function(e) {
      if(e.keyCode==13){
        $('#top .search').off("keypress");
        var view = new Syncd.Views.SearchesIndex({ collection: _self.searches });
        view.on("collection:before:close", function(){
          $('#top .search').on("keypress", keypressCallback);
        });
        Syncd.centerRegion.show(view);
      }
    }

    // Attach event handler to search input
    $('#top .search').on("keypress", keypressCallback);


    // Syncd.centerRegion.on("view:show", function(view){
    //   console.log(view);
    // });
  
  },

  viewPlaylist: function(name) {
    //alert(name);
  }


}); 
