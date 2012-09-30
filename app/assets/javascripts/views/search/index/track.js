Syncd.Views.SearchTrack = Backbone.Marionette.ItemView.extend({
	template: "searches/index/song",
	className: "track",

	events: {
		"dblclick": "play"
	},

	play: function() {
		$('.search .active').removeClass("active");
		this.$el.addClass("active");
		this.model.play();
	}

});