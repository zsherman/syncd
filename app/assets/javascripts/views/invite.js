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

    // Add current user to playlist (i.e. notify the server that the invitation has been accepted)
    // and add the new playlist the playlist collection
    this.model.addPlaylist();

  }
});