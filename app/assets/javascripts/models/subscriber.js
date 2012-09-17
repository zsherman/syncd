Syncd.Models.Subscriber = Backbone.RelationalModel.extend({

	initialize: function() {
		_.bindAll(this);
	},


	urlRoot: function() { return '/playlists/'+this.get("playlist_id")+'/subscribers' }

});