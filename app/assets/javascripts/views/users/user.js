Syncd.Views.User = Backbone.Marionette.ItemView.extend({
  template: "users/user",
  className: "user-block",

  initialize: function() {
  	//$('.follow-button').click(this.model.follow());
  	self = this;
    this.model.assureFetched(function() {
      //var playlistsView = new Syncd.Views.UserPlaylistsIndex({collection: self.model.get("playlists")});
      //Syncd.centerRegion.show(playlistsView);
      // var followingView = new Syncd.Views.FollowingIndex({collection: self.model.get("following")});
      // Syncd.right_layout.subscribers.show(followingView);
      // var followersView = new Syncd.Views.FollowersIndex({collection: self.model.get("followers")});
      // Syncd.right_layout.tags.show(followersView);
    });
  }


});