Syncd.Views.Invite = Backbone.Marionette.ItemView.extend({
  template: "invites/invite",
  className: "single-invite",

  events: {
  	"click": "accept"
  },

  accept: function() {
  	var _self = this;

  	// Remove click binding
  	this.undelegateEvents();

  	// Edit view to display confirmation and close after 1 second
  	var el = this.make("span", {"class": "accepted"}, "Invitation accepted");
  	this.$el.html(el);
  	setTimeout(function () {
	   $(".invites-button").trigger('click');
	}, 1000);

  	// Remove invitation
  	setTimeout(function () {
    	_self.model.destroy();
	}, 1500);

  	// Add new playlist to playlist collection
  	var playlist = new Syncd.Models.Playlist({id: this.model.get("playlist_id"), name: this.model.get("playlist_name")});
  	playlist.fetch({success: function(model) {
        	Syncd.Instances.PlaylistCollection.add(model);
        }
    });

  }
});