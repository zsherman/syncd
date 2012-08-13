Syncd.Collections.Subscribers = Backbone.Collection.extend({ 
	model: Syncd.Models.Subscriber, 
	url: function() {
		return '/playlists/' + this.parent.id + '/subscribers';
	}
});