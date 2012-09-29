Syncd.Layouts.Player = Backbone.Marionette.Layout.extend({
	template: "player/layout",
	el: "#bottom",
  regions: {
    nowplaying: ".now-playing",
    buttons: ".controls .buttons",
    progressbar: ".controls .progress-bar",
    volume: ".controls .audio"
  }
});