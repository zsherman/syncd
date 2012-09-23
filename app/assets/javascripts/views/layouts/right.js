Syncd.Layouts.Right = Backbone.Marionette.Layout.extend({
	template: "right/layout",
	el: "#right",
	regions: {
	  subscribers: ".subscriptions .subscribers",
	  tags: ".tags"
	}
});