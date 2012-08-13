Syncd.Views.InvitesIndex = Backbone.Marionette.CollectionView.extend({

	initialize: function() {
		_.bindAll(this);
	},

 	itemView: Syncd.Views.Invite,

	className: "invite-container"
	
});