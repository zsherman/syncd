Syncd.Views.Track = Backbone.Marionette.ItemView.extend({
	template: "searches/song",
	className: "track",

	events: {
		"click": "play"
	},

	play: function() {
		$('.search .active').removeClass("active");
		this.$el.addClass("active");
		this.model.play();
	}

});