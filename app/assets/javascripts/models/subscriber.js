Syncd.Models.Subscriber = Backbone.Model.extend({

	initialize: function() {
		_.bindAll(this);
	},


	urlRoot: function() { return '/playlists/'+this.get("playlist_id")+'/subscribers' }

});