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
    
    // Render invitations
    var invitationsView = new Syncd.Views.InvitesIndex({collection: this.invitations});
    $('#top .invites-container .content').html(invitationsView.render().$el);

    $('#top .invites-button').toggle(function() {
      $('#top .invites-container').fadeIn(400);
    }, function() {
      $('#top .invites-container').fadeOut(400);
    });

    // Render trending playlists, songs, albums, etc

    // Function to handle generation and presentation of search results
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

    var streamCallback = function(e) {
      // Instantiate StreamItemsIndex
      // Show the view in the center region
    }

    // Attach event handler to search input
    $("#top .search").on("keypress", keypressCallback);

    // Attach click event to stream menu item
    // $('#stream').on("click", streamCallback);

    // Toggle list view and album view
    $("#top .toggle").toggle (function() {
      $(".button", this).css('left', '28px');
      Syncd.state.songsview.toggle = "list";
      Syncd.vent.trigger("songsview.toggle:updated");
    }, function() {
      $(".button", this).css('left', '0px');
      Syncd.state.songsview.toggle = "album";
      Syncd.vent.trigger("songsview.toggle:updated");
    });
  
  },

  viewPlaylist: function(name) {
    //alert(name);
  }


}); 
