Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    'playlists': 'index',
    '': 'index',
    'playlists/:name': 'viewPlaylist',
    'search': 'search',
    "users/:id": "userProfile",
  },
  
  initialize: function(options) {
    var _self = this;
  	this.playlists = options.playlists;
    this.invitations = options.invitations;

    var uid = localStorage.getItem("uid").replace(/"/g, '');
    new BackboneSync.RailsFayeSubscriber(this.playlists, {
      channel: uid+'/playlists', 
      client: faye
    });

    // Event aggregator
    var vent = _.extend({}, Backbone.Events);

    // Set up user-editable playlists
    var userPlaylists = new Syncd.Views.PlaylistsIndex({collection: this.playlists, router: this, vent: vent});
    $('.playlists ul').html(userPlaylists.render().$el);
    
    // Render invitations and set up toggle event binding
    var invitationsView = new Syncd.Views.InvitesIndex({collection: this.invitations});
    $('#top .invites-container .content').html(invitationsView.render().$el);
    $('#top .invites-button').toggle(function() {
      $('#top .invites-container').fadeIn(400);
    }, function() {
      $('#top .invites-container').fadeOut(400);
    });

    // Attach event handler to search input
    $("#top .search").on("keypress", function(e) {
      if(e.keyCode==13){
        var search_term = $('#top .search').val();
        var searchCollection = new Syncd.Collections.Searches({input: search_term});

        searchCollection.fetch({
          success: function(collection) {
            collection.initSongs();
            var layout = new Syncd.Layouts.Search({collection: collection});
            var tracksView = new Syncd.Views.SearchTrackIndex({collection: collection});
            var artists = new Syncd.Views.SearchArtistIndex({collection: collection.artists});
            var albums = new Syncd.Views.SearchAlbumIndex({collection: collection.albums});

            Syncd.centerRegion.show(layout);
            layout.tracks.show(tracksView);
            layout.artists.show(artists);
            layout.albums.show(albums);
          }
        });
      }
    });

    // Atach toggle event to render list view/album view
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
  
  index: function() {

    
  },

  search: function() {
  
  },

  viewPlaylist: function(num) {
    this.playlists.get(num).trigger("setActive");
  },

  userProfile: function(id) {
    //navigate with Syncd.Routers.Playlists.prototype.__proto__.navigate('/users/2', true);
    var user = new Syncd.Models.User({id: id});
    user.fetch({
      success: function(data) {
        var userProfile = new Syncd.Views.User({model: user});
        Syncd.centerRegion.show(userProfile);
      }
    });
  },


}); 
