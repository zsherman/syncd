Syncd.Collections.Invites = Backbone.Collection.extend({ 
	model: Syncd.Models.Invite, 
	url: function() {
		return '/playlists/' + this.parent.id + '/subscribers';
	}
});