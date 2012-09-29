Syncd.Models.Tag = Backbone.Model.extend({

	initialize: function() {
		_.bindAll(this);
		this.initTags();
	},

	initTags: function() {
		console.log("initTags running.");
	},

	url: "/tags"

});