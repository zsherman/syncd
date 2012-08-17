Syncd.Collections.Invites = Backbone.Collection.extend({ 
	model: Syncd.Models.Invite, 
	initialize: function() {
		var uid = localStorage.getItem("uid").replace(/"/g, '');
		new BackboneSync.RailsFayeSubscriber(this, {
	    	channel: uid+'/invitations', // Set to Rails model.class.table_name, or override Model.faye_channel
	    	client: faye
    	});
	},
	url: function() {
		return '/playlists/' + this.parent.id + '/subscribers';
	}
});