Syncd.Routers.Playlists = Backbone.Router.extend({

  routes: {
    'playlists': 'index',
    '': 'index',
    'playlists/:name': 'viewPlaylist',
    'search': 'search'
  },
  
  initialize: function(options) {
    var _self = this;
  	this.playlists = options.playlists;
    this.invitations = options.invitations;
    this.searches = options.searches;

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
        // $('#top .search').off("keypress");
        // var view = new Syncd.Views.SearchesIndex({ collection: _self.searches });
        // view.on("collection:before:close", function(){
        //   $('#top .search').on("keypress", keypressCallback);
        // });
        Syncd.centerRegion.show(new Syncd.Layouts.Search());
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
    var searchCollection = new Syncd.Collections.Searches({});
    searchCollection.fetch({
      success: function() {
      }
    });

    console.log(searchCollection);
    Syncd.centerRegion.show(new Syncd.Layouts.Search());
  
  },

  viewPlaylist: function(num) {
    this.playlists.get(num).trigger("setActive");
  }


}); 
