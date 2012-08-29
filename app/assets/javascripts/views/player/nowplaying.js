Syncd.Views.NowPlaying = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    _.bindAll(this);
    Syncd.vent.bindTo("play", this.setModel);
  },
  
  template: "player/nowplaying",

  events: {
  },
  
  setModel: function(model) {
  	this.model = model;
  	this.render();
  }

});