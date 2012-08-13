Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    'playlists': 'index',
    '': 'index',
    'playlists/:name': 'viewPlaylist',
  },
  
  initialize: function(options) {
  	this.collection = options.collection;
    this.invitations = options.invitations;
    var uid = localStorage.getItem("uid").replace(/"/g, '');
    new BackboneSync.RailsFayeSubscriber(this.collection, {
      channel: uid+'/playlists', // Set to Rails model.class.table_name, or override Model.faye_channel
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

    // Render invitations
    var invitationsView = new Syncd.Views.InvitesIndex({collection: this.invitations});
    $('#top .invitelist .content').html(invitationsView.render().$el);

    $('#top .invites').toggle(function() {
      $('#top .invitelist').css('display', 'block');
    }, function() {
      $('#top .invitelist').css('display', 'none');
    });

  
  },

  viewPlaylist: function(name) {
    //alert(name);
  }


}); 
